import { useState } from 'react'
import MainScreen from './screens/MainScreen'
import HistoryScreen from './screens/HistoryScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  const [screen, setScreen] = useState('main')

  return (
    <div className="app">
      {screen === 'main' && (
        <MainScreen
          onHistory={() => setScreen('history')}
          onSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'history' && <HistoryScreen onBack={() => setScreen('main')} />}
      {screen === 'settings' && <SettingsScreen onBack={() => setScreen('main')} />}
    </div>
  )
}
