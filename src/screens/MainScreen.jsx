import { useState, useCallback } from 'react'
import ScrollPicker from '../components/ScrollPicker'
import './MainScreen.css'

const SCORES = Array.from({ length: 30 }, (_, i) => i)
const SETS = ['1세트', '2세트', '3세트', '4세트', '5세트']

function isValidScore(a, b) {
  if (a === b) return false
  const max = Math.max(a, b)
  const min = Math.min(a, b)
  if (max < 11) return false
  if (max === 11) return min <= 9
  return max - min >= 2
}

export default function MainScreen({ onHistory }) {
  const [mode, setMode] = useState('단식')
  const [winRule, setWinRule] = useState('2선승')
  const [leftName, setLeftName] = useState('홍길동')
  const [rightName, setRightName] = useState('김철수')
  const [currentSet, setCurrentSet] = useState('1세트')
  const [leftScore, setLeftScore] = useState(0)
  const [rightScore, setRightScore] = useState(0)
  const [setResults, setSetResults] = useState({})
  const [now] = useState(new Date())

  const setIndex = SETS.indexOf(currentSet)

  const leftSetWins = Object.values(setResults).filter(r => r.winner === 'left').length
  const rightSetWins = Object.values(setResults).filter(r => r.winner === 'right').length

  const getSetResult = (setKey) => setResults[setKey]

  const handleSaveSet = useCallback(() => {
    if (!isValidScore(leftScore, rightScore)) return
    const winner = leftScore > rightScore ? 'left' : 'right'
    const newResults = {
      ...setResults,
      [currentSet]: { left: leftScore, right: rightScore, winner }
    }
    setSetResults(newResults)

    const nextIdx = setIndex + 1
    if (nextIdx < SETS.length) {
      setCurrentSet(SETS[nextIdx])
      setLeftScore(0)
      setRightScore(0)
    }
  }, [leftScore, rightScore, currentSet, setIndex, setResults])

  const valid = isValidScore(leftScore, rightScore)

  const formatDate = (d) => {
    const m = d.getMonth() + 1
    const day = d.getDate()
    const h = d.getHours().toString().padStart(2, '0')
    const min = d.getMinutes().toString().padStart(2, '0')
    return `${m}월 ${day}일 ${h}:${min}`
  }

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
          <button className="history-btn" onClick={onHistory}>기록</button>
        </div>
      </div>

      <div className="meta-row">
        <button className="meta-pill">
          <span>🕐</span> {formatDate(now)} ✏️
        </button>
        <button className="meta-pill">
          <span>📍</span> OO탁구장 ✏️
        </button>
      </div>

      <div className="names-section">
        <div className="names-row">
          <input className="player-name" value={leftName} onChange={e => setLeftName(e.target.value)} />
          <span className="vs-small">vs</span>
          <input className="player-name" value={rightName} onChange={e => setRightName(e.target.value)} />
        </div>
        <div className="record-row">
          <span className="rec">5승 2패</span>
          <span className="rec-sep">7전</span>
          <span className="rec">2승 5패</span>
        </div>
      </div>

      <div className="divider" />

      <div className="set-picker-row">
        <span className={`set-result ${getSetResult(currentSet)?.winner === 'left' ? 'win' : getSetResult(currentSet)?.winner === 'right' ? 'lose' : 'none'}`}>
          {getSetResult(currentSet)?.winner === 'left' ? '승' : getSetResult(currentSet)?.winner === 'right' ? '패' : '-'}
        </span>
        <div className="set-picker-wrap">
          {SETS.slice(0, winRule === '2선승' ? 3 : 5).map((s, i) => (
            <div
              key={s}
              className={`set-item ${s === currentSet ? 'active' : ''} ${i === setIndex - 1 || i === setIndex + 1 ? 'adj' : ''}`}
              onClick={() => setCurrentSet(s)}
            >
              {s}
            </div>
          ))}
        </div>
        <span className={`set-result ${getSetResult(currentSet)?.winner === 'right' ? 'win' : getSetResult(currentSet)?.winner === 'left' ? 'lose' : 'none'}`}>
          {getSetResult(currentSet)?.winner === 'right' ? '승' : getSetResult(currentSet)?.winner === 'left' ? '패' : '-'}
        </span>
      </div>

      <div className="divider" />

      <div className="score-section">
        <div className="score-main-row">
          <ScrollPicker items={SCORES} value={leftScore} onChange={setLeftScore} />

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

          <ScrollPicker items={SCORES} value={rightScore} onChange={setRightScore} />
        </div>

        <button
          className={`set-save-btn ${valid ? 'active' : ''}`}
          onClick={handleSaveSet}
          disabled={!valid}
        >
          세트 저장 {valid ? `(${leftScore}:${rightScore})` : ''}
        </button>
      </div>

      <div className="save-area">
        <button className="save-btn">경기 저장</button>
      </div>
    </div>
  )
}
