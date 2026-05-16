const RECORDS_KEY = 'ttrecord_records'
const NAMES_KEY = 'ttrecord_names'
const PLACES_KEY = 'ttrecord_places'

export function getRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]')
  } catch { return [] }
}

export function saveRecord(record) {
  const records = getRecords()
  records.unshift({ ...record, id: Date.now() })
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function deleteRecord(id) {
  const records = getRecords().filter(r => r.id !== id)
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function getNames() {
  try {
    return JSON.parse(localStorage.getItem(NAMES_KEY) || '[]')
  } catch { return [] }
}

export function saveName(name) {
  if (!name.trim()) return
  const names = getNames().filter(n => n !== name)
  names.unshift(name)
  localStorage.setItem(NAMES_KEY, JSON.stringify(names.slice(0, 20)))
}

export function deleteName(name) {
  const names = getNames().filter(n => n !== name)
  localStorage.setItem(NAMES_KEY, JSON.stringify(names))
}

export function getPlaces() {
  try {
    return JSON.parse(localStorage.getItem(PLACES_KEY) || '[]')
  } catch { return [] }
}

export function savePlace(place) {
  if (!place.trim()) return
  const places = getPlaces().filter(p => p.name !== place.name)
  places.unshift(place)
  localStorage.setItem(PLACES_KEY, JSON.stringify(places))
}

export function getStats(leftNames, rightNames) {
  const records = getRecords()
  const leftKey = leftNames.join(',')
  const rightKey = rightNames.join(',')

  let leftWins = 0, rightWins = 0, total = 0

  records.forEach(r => {
    const rLeftKey = (r.leftNames || [r.leftName]).join(',')
    const rRightKey = (r.rightNames || [r.rightName]).join(',')
    const match1 = rLeftKey === leftKey && rRightKey === rightKey
    const match2 = rLeftKey === rightKey && rRightKey === leftKey
    if (match1 || match2) {
      total++
      if (match1 && r.winner === 'left') leftWins++
      else if (match1 && r.winner === 'right') rightWins++
      else if (match2 && r.winner === 'left') rightWins++
      else if (match2 && r.winner === 'right') leftWins++
    }
  })

  return { leftWins, rightWins, total }
}
