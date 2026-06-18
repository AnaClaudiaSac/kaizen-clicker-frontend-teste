import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChartPoint } from '../../engine/history'

interface ProductionChartProps {
  data: ChartPoint[]
}

export function ProductionChart({ data }: ProductionChartProps) {
  return (
    <div className="kc-chart-card">
      <p className="kc-chart-title">Produção acumulada</p>
      <div className="kc-chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="timestamp" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="produced" stroke="#1db97a" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
