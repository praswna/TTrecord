import { useState, useEffect } from 'react'
import { getRecords, deleteRecord } from '../utils/storage'
import './HistoryScreen.css'

function formatDate(iso) {
  const d = new Date(iso)
  const m = d.getMonth() + 1
  const day = d.getDate()
  const h = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${m}월 ${day}일 ${h}:${min}`
}

export default function HistoryScreen({ onBack }) {
  const [records, setRecords] = useState([])
  const [placeFilter, setPlaceFilter] = useState('전체')

  useEffect(() => {
    setRecords(getRecords())
  }, [])

  const places = ['전체', ...new Set(records.map(r => r.place).filter(Boolean))]

  const filtered = placeFilter === '전체'
    ? records
    : records.filter(r => r.place === placeFilter)

  const handleDelete = (id) => {
    deleteRecord(id)
    setRecords(getRecords())
  }

  const getSetScore = (setResults) => {
    const vals = Object.values(setResults)
    const lw = vals.filter(s => s.winner === 'left').length
    const rw = vals.filter(s => s.winner === 'right').length
    return { lw, rw }
  }

  if (records.length === 0) {
    return (
      <div className="history">
        <div className="history-topbar">
          <button className="back-btn" onClick={onBack}>← 돌아가기</button>
          <div className="history-title">히스토리</div>
          <div style={{ width: 80 }} />
        </div>
        <div className="history-empty">
          <div className="empty-icon">🏓</div>
          <div className="empty-text">저장된 경기가 없어요</div>
          <div className="empty-sub">경기를 저장하면 여기에 기록돼요</div>
        </div>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="history-topbar">
        <button className="back-btn" onClick={onBack}>← 돌아가기</button>
        <div className="history-title">히스토리</div>
        <div style={{ width: 80 }} />
      </div>

      {places.length > 2 && (
        <div className="place-filter">
          {places.map(p => (
            <button key={p} className={`place-chip ${placeFilter === p ? 'on' : ''}`} onClick={() => setPlaceFilter(p)}>{p}</button>
          ))}
        </div>
      )}

      <div className="history-list">
        {filtered.map(r => {
          const { lw, rw } = getSetScore(r.setResults)
          const leftWon = lw > rw
          const sets = Object.values(r.setResults)
          return (
            <div key={r.id} className="game-card">
              <div className="card-top">
                <div className={`pname-col ${leftWon ? 'won' : 'lost'}`}>
                  {r.leftNames.map((n, i) => <div key={i} className="pname">{n}</div>)}
                </div>
                <div className="set-score-center">
                  <div className="set-score-big">{lw} : {rw}</div>
                  <div className="set-score-label">세트</div>
                </div>
                <div className={`pname-col right ${!leftWon ? 'won' : 'lost'}`}>
                  {r.rightNames.map((n, i) => <div key={i} className="pname">{n}</div>)}
                </div>
              </div>
              <div className="card-sets">
                {sets.map((s, i) => (
                  <div key={i} className="set-row">
                    <span className={s.winner === 'left' ? 's-win' : 's-lose'}>{s.left}</span>
                    <span className="s-div">:</span>
                    <span className={s.winner === 'right' ? 's-win' : 's-lose'}>{s.right}</span>
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <div className="card-meta">
                  <span>⏱ {formatDate(r.date)}</span>
                  <span>📍 {r.place}</span>
                  <span>{r.winRule} · {r.mode}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(r.id)}>삭제</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
