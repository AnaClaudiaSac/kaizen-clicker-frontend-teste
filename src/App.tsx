import { FactoryView } from './components/FactoryView/FactoryView'
import { UpgradesList } from './components/UpgradesList/UpgradesList'
import { useGameLoop } from './store/useGameLoop'

function App() {
  useGameLoop()

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-8 text-slate-100">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <h1 className="text-center text-2xl font-semibold">Kaizen Clicker</h1>
        <FactoryView />
        <UpgradesList />
      </div>
    </main>
  )
}

export default App
