import { useState } from 'react'
import './DateModal.css'

export default function DateModal({ date, onSelect, onClose }) {
  const [d, setD] = useState(new Date(date))

  const format = (dt) => {
    const yyyy = dt.getFullYear()
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    const hh = String(dt.getHours()).padStart(2, '0')
    const min = String(dt.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
  }

  const handleChange = (e) => {
    setD(new Date(e.target.value))
  }

  const handleNow = () => {
    setD(new Date())
  }

  const handleConfirm = () => {
    onSelect(d)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">날짜 / 시간 수정</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="date-modal-body">
          <input
            className="date-input"
            type="datetime-local"
            value={format(d)}
            onChange={handleChange}
          />
          <button className="now-btn" onClick={handleNow}>지금으로 설정</button>
          <button className="confirm-btn" onClick={handleConfirm}>확인</button>
        </div>
      </div>
    </div>
  )
}
