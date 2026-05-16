import { useRef, useEffect, useCallback } from 'react'
import './ScrollPicker.css'

export default function ScrollPicker({ items, value, onChange, itemHeight = 44 }) {
  const listRef = useRef(null)
  const isProgrammatic = useRef(false)
  const touchStartY = useRef(0)
  const lastTouchY = useRef(0)
  const lastTouchTime = useRef(0)
  const velocityY = useRef(0)
  const rafId = useRef(null)
  const prevValue = useRef(value)
  const initialized = useRef(false)

  const currentIndex = items.indexOf(value)

  useEffect(() => {
    if (!listRef.current) return
    if (!initialized.current) {
      listRef.current.scrollTop = currentIndex * itemHeight
      initialized.current = true
      return
    }
    if (prevValue.current !== value) {
      prevValue.current = value
      isProgrammatic.current = true
      listRef.current.scrollTo({ top: currentIndex * itemHeight, behavior: 'smooth' })
      setTimeout(() => { isProgrammatic.current = false }, 400)
    }
  }, [value, currentIndex, itemHeight])

  const snapToNearest = useCallback(() => {
    if (!listRef.current) return
    const idx = Math.round(listRef.current.scrollTop / itemHeight)
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    isProgrammatic.current = true
    listRef.current.scrollTo({ top: clamped * itemHeight, behavior: 'smooth' })
    prevValue.current = items[clamped]
    onChange(items[clamped])
    setTimeout(() => { isProgrammatic.current = false }, 400)
  }, [items, onChange, itemHeight])

  const applyInertia = useCallback((velocity) => {
    if (!listRef.current) return
    let v = velocity
    const friction = 0.88

    const step = () => {
      if (Math.abs(v) < 0.5) {
        snapToNearest()
        return
      }
      listRef.current.scrollTop += v
      v *= friction
      rafId.current = requestAnimationFrame(step)
    }
    rafId.current = requestAnimationFrame(step)
  }, [snapToNearest])

  const handleTouchStart = (e) => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    isProgrammatic.current = false
    const y = e.touches[0].clientY
    touchStartY.current = y
    lastTouchY.current = y
    lastTouchTime.current = Date.now()
    velocityY.current = 0
  }

  const handleTouchMove = (e) => {
    e.stopPropagation()
    const y = e.touches[0].clientY
    const now = Date.now()
    const dt = now - lastTouchTime.current
    if (dt > 0) {
      velocityY.current = (lastTouchY.current - y) / dt * 28
    }
    listRef.current.scrollTop += lastTouchY.current - y
    lastTouchY.current = y
    lastTouchTime.current = now
  }

  const handleTouchEnd = () => {
    applyInertia(velocityY.current)
  }

  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return
    const idx = Math.round(listRef.current.scrollTop / itemHeight)
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    if (items[clamped] !== value) {
      prevValue.current = items[clamped]
      onChange(items[clamped])
    }
  }, [items, value, onChange, itemHeight])

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
              if (rafId.current) cancelAnimationFrame(rafId.current)
              isProgrammatic.current = true
              listRef.current.scrollTo({ top: i * itemHeight, behavior: 'smooth' })
              prevValue.current = item
              onChange(item)
              setTimeout(() => { isProgrammatic.current = false }, 400)
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
