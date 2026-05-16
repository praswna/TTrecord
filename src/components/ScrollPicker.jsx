import { useRef, useEffect, useCallback } from 'react'
import './ScrollPicker.css'

export default function ScrollPicker({ items, value, onChange, itemHeight = 44 }) {
  const listRef = useRef(null)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startScrollTop = useRef(0)
  const isScrollingProgrammatically = useRef(false)

  const currentIndex = items.indexOf(value)

  useEffect(() => {
    if (!listRef.current) return
    isScrollingProgrammatically.current = true
    listRef.current.scrollTo({ top: currentIndex * itemHeight, behavior: 'smooth' })
    setTimeout(() => { isScrollingProgrammatically.current = false }, 300)
  }, [value, currentIndex, itemHeight])

  const handleScroll = useCallback(() => {
    if (!listRef.current || isScrollingProgrammatically.current) return
    const idx = Math.round(listRef.current.scrollTop / itemHeight)
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    if (items[clamped] !== value) {
      onChange(items[clamped])
    }
  }, [items, value, onChange, itemHeight])

  const handleTouchStart = (e) => {
    isDragging.current = true
    startY.current = e.touches[0].clientY
    startScrollTop.current = listRef.current.scrollTop
  }

  const handleTouchMove = (e) => {
    if (!isDragging.current) return
    e.stopPropagation()
    const dy = startY.current - e.touches[0].clientY
    listRef.current.scrollTop = startScrollTop.current + dy
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    const idx = Math.round(listRef.current.scrollTop / itemHeight)
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    listRef.current.scrollTo({ top: clamped * itemHeight, behavior: 'smooth' })
    onChange(items[clamped])
  }

  return (
    <div className="scroll-picker">
      <div className="scroll-picker__fade-top" />
      <div className="scroll-picker__fade-bottom" />
      <div className="scroll-picker__selector" />
      <div
        ref={listRef}
        className="scroll-picker__list"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="scroll-picker__padding" style={{ height: itemHeight }} />
        {items.map((item, i) => (
          <div
            key={i}
            className={`scroll-picker__item ${item === value ? 'active' : ''}`}
            style={{ height: itemHeight }}
            onClick={() => {
              listRef.current.scrollTo({ top: i * itemHeight, behavior: 'smooth' })
              onChange(item)
            }}
          >
            {item}
          </div>
        ))}
        <div className="scroll-picker__padding" style={{ height: itemHeight }} />
      </div>
    </div>
  )
}
