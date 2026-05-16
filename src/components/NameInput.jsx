import { useState, useRef, useEffect } from 'react'
import { getNames, deleteName } from '../utils/storage'
import './NameInput.css'

export default function NameInput({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false)
  const [names, setNames] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    setNames(getNames())
  }, [open])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleDelete = (name, e) => {
    e.stopPropagation()
    deleteName(name)
    setNames(getNames())
  }

  return (
    <div className="name-input-wrap" ref={ref}>
      <input
        className="player-name"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '이름'}
        onFocus={() => setOpen(true)}
      />
      {open && names.length > 0 && (
        <div className="name-dropdown">
          {names.map(name => (
            <div key={name} className="name-item" onMouseDown={() => { onChange(name); setOpen(false) }}>
              <span>{name}</span>
              <button className="name-delete" onMouseDown={e => handleDelete(name, e)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
