document.addEventListener('touchmove', function(e) {
  if (e.target.closest('.scroll-picker__list')) return
  e.preventDefault()
}, { passive: false })
