import { useState } from 'react'
import MainScreen from './screens/MainScreen'
import HistoryScreen from './screens/HistoryScreen'

export default function App() {
  const [screen, setScreen] = useState('main')

  return (
    <div className="app">
      {screen === 'main' && <MainScreen onHistory={() => setScreen('history')} />}
      {screen === 'history' && <HistoryScreen onBack={() => setScreen('main')} />}
    </div>
  )
}
