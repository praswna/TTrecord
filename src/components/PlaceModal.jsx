import { useState, useEffect } from 'react'
import './PlaceModal.css'

const PLACES_KEY = 'ttrecord_places'

function getPlaces() {
  try { return JSON.parse(localStorage.getItem(PLACES_KEY) || '[]') } catch { return [] }
}
function savePlaces(places) {
  localStorage.setItem(PLACES_KEY, JSON.stringify(places))
}

export default function PlaceModal({ current, onSelect, onClose }) {
  const [places, setPlaces] = useState([])
  const [newName, setNewName] = useState('')

  useEffect(() => {
    setPlaces(getPlaces())
  }, [])

  const handleAdd = () => {
    if (!newName.trim()) return
    const updated = [newName.trim(), ...places.filter(p => p !== newName.trim())]
    savePlaces(updated)
    setPlaces(updated)
    setNewName('')
  }

  const handleDelete = (name) => {
    const updated = places.filter(p => p !== name)
    savePlaces(updated)
    setPlaces(updated)
  }

  const handleSelect = (name) => {
    onSelect(name)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">장소 선택</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="place-list">
          {places.length === 0 && <div className="place-empty">저장된 장소가 없어요</div>}
          {places.map(p => (
            <div key={p} className={`place-item ${p === current ? 'active' : ''}`}>
              <span onClick={() => handleSelect(p)}>{p}</span>
              <button className="place-delete" onClick={() => handleDelete(p)}>✕</button>
            </div>
          ))}
        </div>

        <div className="place-register">
          <div className="register-title">새 장소 추가</div>
          <input
            className="place-input"
            placeholder="장소 이름 (예: OO탁구장)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button className="register-btn" onClick={handleAdd}>추가</button>
        </div>
      </div>
    </div>
  )
}
