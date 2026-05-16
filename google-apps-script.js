// TTrecord Google Apps Script
// 이 코드를 Google Sheets > 확장 프로그램 > Apps Script에 붙여넣으세요

const SHEET_NAME = '경기기록'

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(SHEET_NAME)

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME)
      sheet.appendRow([
        'ID', '날짜', '장소', '모드', '방식',
        '왼쪽팀', '오른쪽팀', '세트스코어', '세트별점수', '승자'
      ])
      sheet.getRange(1, 1, 1, 10).setFontWeight('bold')
      sheet.setFrozenRows(1)
    }

    const setScores = Object.values(data.setResults || {})
      .map(s => `${s.left}:${s.right}`)
      .join(', ')

    const leftWins = Object.values(data.setResults || {}).filter(s => s.winner === 'left').length
    const rightWins = Object.values(data.setResults || {}).filter(s => s.winner === 'right').length

    sheet.appendRow([
      data.id || Date.now(),
      data.date ? new Date(data.date).toLocaleString('ko-KR') : '',
      data.place || '',
      data.mode || '단식',
      data.winRule || '',
      (data.leftNames || []).join(' / '),
      (data.rightNames || []).join(' / '),
      `${leftWins} : ${rightWins}`,
      setScores,
      data.winner === 'left'
        ? (data.leftNames || []).join(' / ')
        : (data.rightNames || []).join(' / ')
    ])

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) return ContentService
    .createTextOutput(JSON.stringify({ records: [] }))
    .setMimeType(ContentService.MimeType.JSON)

  const rows = sheet.getDataRange().getValues()
  const headers = rows[0]
  const records = rows.slice(1).map(row => {
    const obj = {}
    headers.forEach((h, i) => obj[h] = row[i])
    return obj
  })

  return ContentService
    .createTextOutput(JSON.stringify({ records }))
    .setMimeType(ContentService.MimeType.JSON)
}

// 더미 데이터 생성 함수 (최초 1회 실행)
function insertDummyData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow([
      'ID', '날짜', '장소', '모드', '방식',
      '왼쪽팀', '오른쪽팀', '세트스코어', '세트별점수', '승자'
    ])
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }

  const dummies = [
    [1001, '2025. 5. 17. 오후 2:32', 'OO탁구장', '단식', '3선승', '홍길동', '김철수', '2 : 0', '11:7, 11:5', '홍길동'],
    [1002, '2025. 5. 17. 오전 11:05', 'OO탁구장', '단식', '3선승', '홍길동', '이영희', '2 : 1', '11:9, 8:11, 11:6', '홍길동'],
    [1003, '2025. 5. 16. 오후 8:10', 'XX클럽', '복식', '3선승', '홍길동 / 박민준', '김철수 / 이영희', '1 : 2', '11:8, 7:11, 9:11', '김철수 / 이영희'],
    [1004, '2025. 5. 16. 오후 6:45', 'XX클럽', '단식', '2선승', '홍길동', '박민준', '2 : 0', '11:4, 11:6', '홍길동'],
    [1005, '2025. 5. 15. 오후 7:20', 'OO탁구장', '단식', '3선승', '김철수', '이영희', '2 : 1', '11:8, 9:11, 11:7', '김철수'],
  ]

  dummies.forEach(row => sheet.appendRow(row))
  SpreadsheetApp.getUi().alert('더미 데이터 5개가 추가됐어요!')
}
