import { getTopRanking } from '../../engine/ranking'
import { useGameStore } from '../../store/useGameStore'
import { SaveScoreForm } from './SaveScoreForm'

export function RankingScreen() {
  const ranking = useGameStore((state) => state.ranking)
  const topRanking = getTopRanking(ranking)

  return (
    <div className="kc-left" style={{ width: '100%' }}>
      <SaveScoreForm />

      <div className="kc-panel">
        <h2 className="kc-shop-title" style={{ marginBottom: '12px' }}>
          Top 10
        </h2>
        {topRanking.length === 0 ? (
          <p className="kc-stat-lbl">Nenhuma pontuação salva ainda.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {topRanking.map((entry, index) => (
              <li key={entry.name} className="flex justify-between text-sm" style={{ color: 'var(--kc-text)' }}>
                <span>
                  {index + 1}. {entry.name}
                </span>
                <span className="font-mono">{Math.round(entry.score)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
