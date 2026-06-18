import { useState } from 'react'
import { ConfirmModal } from './components/ConfirmModal/ConfirmModal'
import { Dashboard } from './components/Dashboard/Dashboard'
import { FactoryView } from './components/FactoryView/FactoryView'
import { RankingScreen } from './components/Ranking/RankingScreen'
import { UpgradesList } from './components/UpgradesList/UpgradesList'
import { useGameLoop } from './store/useGameLoop'
import { useGameStore } from './store/useGameStore'

type View = 'game' | 'ranking'

function App() {
  useGameLoop()
  const [view, setView] = useState<View>('game')
  const [showResetModal, setShowResetModal] = useState(false)
  const resetGame = useGameStore((state) => state.resetGame)

  function handleConfirmReset() {
    resetGame()
    setShowResetModal(false)
  }

  return (
    <div className="kc">
      <header className="kc-header">
        <span className="kc-title">Kaizen Clicker</span>
        <nav className="kc-tabs">
          <button
            type="button"
            onClick={() => setView('game')}
            className={`kc-tab ${view === 'game' ? 'active' : ''}`}
          >
            Jogo
          </button>
          <button
            type="button"
            onClick={() => setView('ranking')}
            className={`kc-tab ${view === 'ranking' ? 'active' : ''}`}
          >
            Ranking
          </button>
        </nav>
        <button type="button" onClick={() => setShowResetModal(true)} className="kc-reset-btn">
          Reiniciar
        </button>
      </header>

      <ConfirmModal
        open={showResetModal}
        title="Reiniciar jogo"
        message="Tem certeza que deseja reiniciar o jogo? Todo o progresso será perdido."
        confirmLabel="Sim, reiniciar"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />

      {view === 'game' ? (
        <div className="kc-body">
          <div className="kc-left">
            <FactoryView />
            <Dashboard />
          </div>
          <UpgradesList />
        </div>
      ) : (
        <div className="kc-page">
          <RankingScreen />
        </div>
      )}
    </div>
  )
}

export default App
