import { useState, useEffect } from 'react'
import { getPlaces, savePlace, deletePlace, getCurrentPosition, detectPlace } from '../utils/gps'
import './PlaceModal.css'

export default function PlaceModal({ current, onSelect, onClose }) {
  const [places, setPlaces] = useState([])
  const [newName, setNewName] = useState('')
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [radius, setRadius] = useState(100)
  const [currentPos, setCurrentPos] = useState(null)
  const [detected, setDetected] = useState(null)

  useEffect(() => {
    setPlaces(getPlaces())
    tryDetect()
  }, [])

  const tryDetect = async () => {
    try {
      const pos = await getCurrentPosition()
      setCurrentPos(pos)
      const found = detectPlace(pos.lat, pos.lon)
      if (found) setDetected(found)
    } catch {}
  }

  const handleRegister = async () => {
    if (!newName.trim()) return
    setGpsStatus('loading')
    try {
      const pos = currentPos || await getCurrentPosition()
      setCurrentPos(pos)
      const place = { name: newName.trim(), lat: pos.lat, lon: pos.lon, radius }
      savePlace(place)
      setPlaces(getPlaces())
      setNewName('')
      setGpsStatus('done')
      setTimeout(() => setGpsStatus('idle'), 1500)
    } catch {
      setGpsStatus('error')
      setTimeout(() => setGpsStatus('idle'), 2000)
    }
  }

  const handleDelete = (name) => {
    deletePlace(name)
    setPlaces(getPlaces())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">장소 선택</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {detected && (
          <div className="detected-place" onClick={() => { onSelect(detected.name); onClose() }}>
            <span className="detected-icon">📍</span>
            <span className="detected-name">{detected.name}</span>
            <span className="detected-label">현재 위치</span>
          </div>
        )}

        <div className="place-list">
          {places.map(p => (
            <div key={p.name} className={`place-item ${p.name === current ? 'active' : ''}`}>
              <span onClick={() => { onSelect(p.name); onClose() }}>{p.name}</span>
              <div className="place-item-right">
                <span className="place-radius">{p.radius || 100}m</span>
                <button className="place-delete" onClick={() => handleDelete(p.name)}>✕</button>
              </div>
            </div>
          ))}
          {places.length === 0 && <div className="place-empty">등록된 장소가 없어요</div>}
        </div>

        <div className="place-register">
          <div className="register-title">새 장소 등록</div>
          <input
            className="place-input"
            placeholder="장소 이름 (예: OO탁구장)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <div className="radius-row">
            <span className="radius-label">인식 반경</span>
            <input type="range" min="50" max="500" step="50" value={radius} onChange={e => setRadius(Number(e.target.value))} />
            <span className="radius-val">{radius}m</span>
          </div>
          <button
            className={`register-btn ${gpsStatus}`}
            onClick={handleRegister}
            disabled={gpsStatus === 'loading'}
          >
            {gpsStatus === 'loading' ? 'GPS 위치 확인 중...' :
             gpsStatus === 'done' ? '등록 완료! ✓' :
             gpsStatus === 'error' ? 'GPS 오류 - 다시 시도' :
             '현재 위치로 등록'}
          </button>
        </div>
      </div>
    </div>
  )
}
