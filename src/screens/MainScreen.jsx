import { useState, useCallback, useEffect } from 'react'
import ScrollPicker from '../components/ScrollPicker'
import NameInput from '../components/NameInput'
import { saveRecord, saveName, getStats } from '../utils/storage'
import PlaceModal from '../components/PlaceModal'
import { getCurrentPosition, detectPlace } from '../utils/gps'
import { syncToSheet } from '../utils/sheets'
import './MainScreen.css'

const ALL_SCORES = Array.from({ length: 31 }, (_, i) => i)

function getValidScores(otherScore) {
  return ALL_SCORES.filter(s => {
    const max = Math.max(s, otherScore)
    const min = Math.min(s, otherScore)
    if (s === otherScore) return true
    if (max < 11) return true
    if (max === 11) return min <= 9
    return max - min <= 2
  })
}
const SETS_3 = ['1세트', '2세트', '3세트']
const SETS_5 = ['1세트', '2세트', '3세트', '4세트', '5세트']

function isValidScore(a, b) {
  if (a === b) return false
  const max = Math.max(a, b)
  const min = Math.min(a, b)
  if (max < 11) return false
  if (max === 11) return min <= 9
  return max - min >= 2
}

function formatDate(d) {
  const m = d.getMonth() + 1
  const day = d.getDate()
  const h = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${m}월 ${day}일 ${h}:${min}`
}

export default function MainScreen({ onHistory, onSettings }) {
  const [mode, setMode] = useState('단식')
  const [winRule, setWinRule] = useState('2선승')
  const [leftNames, setLeftNames] = useState(['', ''])
  const [rightNames, setRightNames] = useState(['', ''])
  const [currentSet, setCurrentSet] = useState('1세트')
  const [leftScore, setLeftScore] = useState(0)
  const [rightScore, setRightScore] = useState(0)
  const [setResults, setSetResults] = useState({})
  const [gameDate] = useState(new Date())
  const [place, setPlace] = useState('장소 미설정')
  const [showPlaceModal, setShowPlaceModal] = useState(false)
  
  const [stats, setStats] = useState({ leftWins: 0, rightWins: 0, total: 0 })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getCurrentPosition().then(pos => {
      const found = detectPlace(pos.lat, pos.lon)
      if (found) setPlace(found.name)
    }).catch(() => {})
  }, [])

  const SETS = winRule === '2선승' ? SETS_3 : SETS_5
  const setIndex = SETS.indexOf(currentSet)

  const leftSetWins = Object.values(setResults).filter(r => r.winner === 'left').length
  const rightSetWins = Object.values(setResults).filter(r => r.winner === 'right').length

  const activeLeft = mode === '단식' ? [leftNames[0]].filter(Boolean) : leftNames.filter(Boolean)
  const activeRight = mode === '단식' ? [rightNames[0]].filter(Boolean) : rightNames.filter(Boolean)

  useEffect(() => {
    if (activeLeft.length && activeRight.length) {
      setStats(getStats(activeLeft, activeRight))
    }
  }, [leftNames[0], leftNames[1], rightNames[0], rightNames[1], mode])

  const handleSaveSet = useCallback(() => {
    if (!isValidScore(leftScore, rightScore)) return
    const winner = leftScore > rightScore ? 'left' : 'right'
    const newResults = { ...setResults, [currentSet]: { left: leftScore, right: rightScore, winner } }
    setSetResults(newResults)
    const nextIdx = setIndex + 1
    if (nextIdx < SETS.length) {
      setCurrentSet(SETS[nextIdx])
      setLeftScore(0)
      setRightScore(0)
    }
  }, [leftScore, rightScore, currentSet, setIndex, setResults, SETS])

  const handleSaveGame = useCallback(() => {
    if (!activeLeft.length || !activeRight.length) return
    if (!Object.keys(setResults).length) return
    activeLeft.forEach(saveName)
    activeRight.forEach(saveName)
    const record = {
      mode, winRule,
      leftNames: activeLeft,
      rightNames: activeRight,
      setResults,
      winner: leftSetWins > rightSetWins ? 'left' : 'right',
      date: gameDate.toISOString(),
      place,
    }
    saveRecord(record)
    syncToSheet(record).catch(() => {})
    setSaved(true)
    setTimeout(() => {
      setSetResults({})
      setCurrentSet('1세트')
      setLeftScore(0)
      setRightScore(0)
      setSaved(false)
    }, 1200)
  }, [mode, winRule, activeLeft, activeRight, setResults, leftSetWins, rightSetWins, gameDate, place])

  const valid = isValidScore(leftScore, rightScore)
  const canSaveGame = Object.keys(setResults).length > 0
  const getSetResult = (setKey) => setResults[setKey]

  return (
    <div className="main">
      <div className="topbar">
        <div className="seg">
          {['단식', '복식'].map(m => (
            <button key={m} className={`seg-btn ${mode === m ? 'on' : ''}`} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <div className="right-top">
          <div className="win-seg">
            {['2선승', '3선승'].map(w => (
              <button key={w} className={`win-btn ${winRule === w ? 'on' : ''}`} onClick={() => setWinRule(w)}>{w}</button>
            ))}
          </div>
          <button className="icon-btn" onClick={onHistory} title="기록">📋</button>
          <button className="icon-btn" onClick={onSettings} title="설정">⚙️</button>
        </div>
      </div>

      <div className="meta-row">
        <button className="meta-pill">⏱ {formatDate(gameDate)} ✏</button>
        <button className="meta-pill" onClick={() => setShowPlaceModal(true)}>📍 {place} ✏</button>
      </div>

      <div className="names-section">
        <div className="names-row">
          <div className="names-col">
            <NameInput value={leftNames[0]} onChange={v => setLeftNames([v, leftNames[1]])} placeholder="선수 이름" />
            {mode === '복식' && (
              <NameInput value={leftNames[1]} onChange={v => setLeftNames([leftNames[0], v])} placeholder="선수 이름" />
            )}
          </div>
          <span className="vs-small">vs</span>
          <div className="names-col">
            <NameInput value={rightNames[0]} onChange={v => setRightNames([v, rightNames[1]])} placeholder="선수 이름" />
            {mode === '복식' && (
              <NameInput value={rightNames[1]} onChange={v => setRightNames([rightNames[0], v])} placeholder="선수 이름" />
            )}
          </div>
        </div>
        <div className="record-row">
          <span className="rec">{stats.leftWins}승 {stats.rightWins}패</span>
          <span className="rec-sep">{stats.total}전</span>
          <span className="rec">{stats.rightWins}승 {stats.leftWins}패</span>
        </div>
      </div>

      <div className="divider" />

      <div className="set-picker-row">
        <span className={`set-result ${getSetResult(currentSet)?.winner === 'left' ? 'win' : getSetResult(currentSet)?.winner === 'right' ? 'lose' : 'none'}`}>
          {getSetResult(currentSet)?.winner === 'left' ? '승' : getSetResult(currentSet)?.winner === 'right' ? '패' : '-'}
        </span>
        <div className="set-picker-wrap">
          {SETS.map(s => (
            <div key={s} className={`set-item ${s === currentSet ? 'active' : ''}`} onClick={() => setCurrentSet(s)}>{s}</div>
          ))}
        </div>
        <span className={`set-result ${getSetResult(currentSet)?.winner === 'right' ? 'win' : getSetResult(currentSet)?.winner === 'left' ? 'lose' : 'none'}`}>
          {getSetResult(currentSet)?.winner === 'right' ? '승' : getSetResult(currentSet)?.winner === 'left' ? '패' : '-'}
        </span>
      </div>

      <div className="divider" />

      <div className="score-section">
        <div className="score-main-row">
          <ScrollPicker items={getValidScores(rightScore)} value={leftScore} onChange={v => { setLeftScore(v) }} />
          <div className="center-col">
            <div className="set-score-block">
              <div className="set-score-num">{leftSetWins}</div>
              <div className="set-score-lbl">세트</div>
            </div>
            <div className="set-score-block">
              <div className="set-score-num">{rightSetWins}</div>
              <div className="set-score-lbl">세트</div>
            </div>
          </div>
          <ScrollPicker items={getValidScores(leftScore)} value={rightScore} onChange={v => { setRightScore(v) }} />
        </div>
        <button className={`set-save-btn ${valid ? 'active' : ''}`} onClick={handleSaveSet} disabled={!valid}>
          세트 저장 {valid ? `(${leftScore} : ${rightScore})` : ''}
        </button>
      </div>

      <div className="save-area">
        <button className={`save-btn ${saved ? 'saved' : ''} ${!canSaveGame ? 'disabled' : ''}`} onClick={handleSaveGame} disabled={!canSaveGame}>
          {saved ? '저장 완료! ✓' : '경기 저장'}
        </button>
      </div>
      {showPlaceModal && (
        <PlaceModal current={place} onSelect={setPlace} onClose={() => setShowPlaceModal(false)} />
      )}
    </div>
  )
}
