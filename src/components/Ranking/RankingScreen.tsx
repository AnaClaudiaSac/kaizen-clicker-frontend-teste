import { getTopRanking } from '../../engine/ranking'
import { useGameStore } from '../../store/useGameStore'
import { SaveScoreForm } from './SaveScoreForm'

export function RankingScreen() {
  const ranking = useGameStore((state) => state.ranking)
  const topRanking = getTopRanking(ranking)

  return (
    <section className="flex flex-col gap-4">
      <SaveScoreForm />

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Top 10</h2>
        {topRanking.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma pontuação salva ainda.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {topRanking.map((entry, index) => (
              <li key={entry.name} className="flex justify-between text-sm text-slate-200">
                <span>
                  {index + 1}. {entry.name}
                </span>
                <span className="font-mono">{Math.round(entry.score)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
