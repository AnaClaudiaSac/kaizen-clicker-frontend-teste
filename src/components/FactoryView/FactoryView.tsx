import { calculateFactoryStats } from '../../engine/upgrades'
import { useGameStore } from '../../store/useGameStore'

export function FactoryView() {
  const game = useGameStore((state) => state.game)
  const stats = calculateFactoryStats(game.purchases)

  return (
    <section className="flex flex-col items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 p-6">
      <p className="text-sm text-slate-400">Pontos Kaizen</p>
      <p className="text-4xl font-bold text-emerald-400">{Math.floor(game.points)}</p>

      <div className="mt-2 grid w-full grid-cols-3 gap-4 text-center text-sm text-slate-400">
        <div>
          <p className="text-base text-slate-200">{stats.productionRate.toFixed(2)}/s</p>
          <p>Produção</p>
        </div>
        <div>
          <p className="text-base text-slate-200">{(stats.defectRate * 100).toFixed(0)}%</p>
          <p>Defeito</p>
        </div>
        <div>
          <p className="text-base text-slate-200">{(stats.oee * 100).toFixed(0)}%</p>
          <p>OEE</p>
        </div>
      </div>
    </section>
  )
}
