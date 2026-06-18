import { toChartPoints } from '../../engine/history'
import { calculateFactoryStats } from '../../engine/upgrades'
import { useGameStore } from '../../store/useGameStore'
import { DefectsChart } from './DefectsChart'
import { OeeGauge } from './OeeGauge'
import { ProductionChart } from './ProductionChart'

export function Dashboard() {
  const game = useGameStore((state) => state.game)
  const stats = calculateFactoryStats(game.purchases)
  const chartData = toChartPoints(game.history)

  return (
    <>
      <OeeGauge oee={stats.oee} />
      <div className="kc-charts">
        <ProductionChart data={chartData} />
        <DefectsChart data={chartData} />
      </div>
    </>
  )
}
