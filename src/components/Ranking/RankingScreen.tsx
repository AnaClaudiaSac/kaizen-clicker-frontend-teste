import { getInitials, getTopRanking } from '../../engine/ranking'
import { useGameStore } from '../../store/useGameStore'
import { SaveScoreForm } from './SaveScoreForm'

const PODIUM_CLASSES = ['gold', 'silver', 'bronze']

export function RankingScreen() {
  const ranking = useGameStore((state) => state.ranking)
  const lastSavedPlayerName = useGameStore((state) => state.lastSavedPlayerName)
  const topRanking = getTopRanking(ranking)

  return (
    <>
      <SaveScoreForm />

      <div className="kc-panel">
        <h2 className="kc-shop-title" style={{ marginBottom: '12px' }}>
          Top 10
        </h2>
        {topRanking.length === 0 ? (
          <p className="kc-stat-lbl">Nenhuma pontuação salva ainda.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {topRanking.map((entry, index) => {
              const isMe = entry.name === lastSavedPlayerName
              const podiumClass = PODIUM_CLASSES[index] ?? ''

              return (
                <li key={entry.name} className={`kc-rank-item ${isMe ? 'me' : ''}`}>
                  <span className={`kc-rank-pos ${podiumClass}`}>{index + 1}</span>
                  <span className="kc-rank-avatar">{getInitials(entry.name)}</span>
                  <span className="kc-rank-info">
                    <span className="kc-rank-name">{entry.name}</span>
                    <br />
                    <span className="kc-rank-pts">{Math.round(entry.score)} pts</span>
                  </span>
                  {isMe && <span className="kc-rank-badge">você</span>}
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </>
  )
}
