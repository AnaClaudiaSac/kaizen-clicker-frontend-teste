import { useState } from 'react'
import { Dashboard } from './components/Dashboard/Dashboard'
import { FactoryView } from './components/FactoryView/FactoryView'
import { RankingScreen } from './components/Ranking/RankingScreen'
import { UpgradesList } from './components/UpgradesList/UpgradesList'
import { useGameLoop } from './store/useGameLoop'

type View = 'game' | 'ranking'

function App() {
  useGameLoop()
  const [view, setView] = useState<View>('game')

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-8 text-slate-100">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <h1 className="text-center text-2xl font-semibold">Kaizen Clicker</h1>

        <nav className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setView('game')}
            className={`rounded-md px-4 py-2 text-sm font-medium ${view === 'game' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Jogo
          </button>
          <button
            type="button"
            onClick={() => setView('ranking')}
            className={`rounded-md px-4 py-2 text-sm font-medium ${view === 'ranking' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Ranking
          </button>
        </nav>

        {view === 'game' ? (
          <>
            <FactoryView />
            <Dashboard />
            <UpgradesList />
          </>
        ) : (
          <RankingScreen />
        )}
      </div>
    </main>
  )
}

export default App
