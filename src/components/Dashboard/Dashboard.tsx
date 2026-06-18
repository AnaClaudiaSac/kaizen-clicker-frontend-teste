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
    <section className="grid gap-4 sm:grid-cols-2">
      <ProductionChart data={chartData} />
      <DefectsChart data={chartData} />
      <OeeGauge oee={stats.oee} />
    </section>
  )
}
