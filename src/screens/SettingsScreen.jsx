import { useState } from 'react'
import { getSheetUrl, setSheetUrl } from '../utils/sheets'
const VERSION = '0.1.2'
import './SettingsScreen.css'

export default function SettingsScreen({ onBack }) {
  const [url, setUrl] = useState(getSheetUrl())
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSheetUrl(url)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="settings">
      <div className="settings-topbar">
        <button className="back-btn" onClick={onBack}>← 돌아가기</button>
        <div className="settings-title">설정</div>
        <div style={{ width: 80 }} />
      </div>

      <div className="settings-section">
        <div className="section-title">구글 시트 연동</div>
        <div className="section-desc">
          경기 기록을 구글 시트에 자동으로 저장해요.<br />
          Apps Script 배포 URL을 입력하세요.
        </div>

        <div className="how-to">
          <div className="how-title">연동 방법</div>
          <ol className="how-list">
            <li>구글 시트 열기</li>
            <li>확장 프로그램 → Apps Script</li>
            <li>google-apps-script.js 코드 붙여넣기</li>
            <li>배포 → 새 배포 → 웹 앱</li>
            <li>액세스: 모든 사용자 선택</li>
            <li>배포 URL 아래에 입력</li>
          </ol>
        </div>

        <input
          className="url-input"
          placeholder="https://script.google.com/macros/s/..."
          value={url}
          onChange={e => setUrl(e.target.value)}
        />

        <button className={`save-url-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
          {saved ? '저장 완료! ✓' : 'URL 저장'}
        </button>

        {url && (
          <div className="url-status">
            <span className="url-dot">●</span> 구글 시트 연동 활성화됨
          </div>
        )}
      </div>
      <div className="version-info">v{VERSION}</div>
    </div>
  )
}
