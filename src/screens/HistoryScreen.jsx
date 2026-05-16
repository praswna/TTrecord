import './HistoryScreen.css'

export default function HistoryScreen({ onBack }) {
  const records = [
    { id: 1, left: '홍길동', right: '김철수', sets: [{l:11,r:7},{l:11,r:5}], date: '5월 17일 14:32', place: 'OO탁구장', rule: '3선승' },
    { id: 2, left: '홍길동', right: '이영희', sets: [{l:11,r:9},{l:8,r:11},{l:11,r:6}], date: '5월 17일 11:05', place: 'OO탁구장', rule: '3선승' },
    { id: 3, left: '홍길동', right: '박민준', sets: [{l:11,r:8},{l:5,r:11},{l:3,r:11}], date: '5월 16일 20:10', place: 'XX클럽', rule: '3선승' },
  ]

  const getSetScore = (sets) => {
    const lw = sets.filter(s => s.l > s.r).length
    const rw = sets.filter(s => s.r > s.l).length
    return { lw, rw }
  }

  return (
    <div className="history">
      <div className="history-topbar">
        <button className="back-btn" onClick={onBack}>← 돌아가기</button>
        <div className="history-title">히스토리</div>
        <div style={{width:60}} />
      </div>

      <div className="history-list">
        {records.map(r => {
          const { lw, rw } = getSetScore(r.sets)
          const win = lw > rw
          return (
            <div key={r.id} className="game-card">
              <div className="card-top">
                <div className={`pname ${win ? 'pname-win' : 'pname-lose'}`}>{r.left}</div>
                <div className="set-score-center">
                  <div className="set-score-big">{lw} : {rw}</div>
                  <div className="set-score-label">세트</div>
                </div>
                <div className={`pname pname-right ${!win ? 'pname-win' : 'pname-lose'}`}>{r.right}</div>
              </div>
              <div className="card-sets">
                {r.sets.map((s, i) => (
                  <div key={i} className="set-row">
                    <span className={s.l > s.r ? 's-win' : 's-lose'}>{s.l}</span>
                    <span className="s-div">:</span>
                    <span className={s.r > s.l ? 's-win' : 's-lose'}>{s.r}</span>
                  </div>
                ))}
              </div>
              <div className="card-meta">
                <span>🕐 {r.date}</span>
                <span>📍 {r.place}</span>
                <span>{r.rule}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
