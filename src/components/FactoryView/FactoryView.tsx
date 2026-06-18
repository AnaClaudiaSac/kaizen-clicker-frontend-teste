import { calculateFactoryStats } from '../../engine/upgrades'
import { useGameStore } from '../../store/useGameStore'
import { PieceAnimation } from './PieceAnimation'

export function FactoryView() {
  const game = useGameStore((state) => state.game)
  const stats = calculateFactoryStats(game.purchases)

  return (
    <>
      <div className="kc-pts-bar">
        <div>
          <p className="kc-pts-label">Pontos Kaizen</p>
          <p className="kc-pts-val">{Math.floor(game.points)}</p>
        </div>
        <PieceAnimation />
      </div>

      <div className="kc-stats">
        <div className="kc-stat">
          <p className="kc-stat-val green">{stats.productionRate.toFixed(2)}/s</p>
          <p className="kc-stat-lbl">Produção</p>
        </div>
        <div className="kc-stat">
          <p className="kc-stat-val red">{(stats.defectRate * 100).toFixed(0)}%</p>
          <p className="kc-stat-lbl">Defeito</p>
        </div>
      </div>
    </>
  )
}
