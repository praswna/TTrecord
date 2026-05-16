const SHEET_URL_KEY = 'ttrecord_sheet_url'

export function getSheetUrl() {
  return localStorage.getItem(SHEET_URL_KEY) || ''
}

export function setSheetUrl(url) {
  localStorage.setItem(SHEET_URL_KEY, url)
}

export async function syncToSheet(record) {
  const url = getSheetUrl()
  if (!url) return { success: false, reason: 'no_url' }

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(record),
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Sheet sync failed:', err)
    return { success: false, reason: err.message }
  }
}

export async function fetchFromSheet() {
  const url = getSheetUrl()
  if (!url) return []
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.records || []
  } catch {
    return []
  }
}
