const PLACES_KEY = 'ttrecord_places'
const DEFAULT_RADIUS = 100

export function getPlaces() {
  try {
    return JSON.parse(localStorage.getItem(PLACES_KEY) || '[]')
  } catch { return [] }
}

export function savePlace(place) {
  const places = getPlaces().filter(p => p.name !== place.name)
  places.unshift(place)
  localStorage.setItem(PLACES_KEY, JSON.stringify(places))
}

export function deletePlace(name) {
  const places = getPlaces().filter(p => p.name !== name)
  localStorage.setItem(PLACES_KEY, JSON.stringify(places))
}

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export function detectPlace(lat, lon) {
  const places = getPlaces()
  for (const p of places) {
    const radius = p.radius || DEFAULT_RADIUS
    if (getDistance(lat, lon, p.lat, p.lon) <= radius) {
      return p
    }
  }
  return null
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GPS를 지원하지 않는 기기예요'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject(err),
      { timeout: 8000, maximumAge: 60000 }
    )
  })
}
