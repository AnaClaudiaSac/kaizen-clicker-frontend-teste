import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChartPoint } from '../../engine/history'

interface DefectsChartProps {
  data: ChartPoint[]
}

export function DefectsChart({ data }: DefectsChartProps) {
  return (
    <div className="kc-chart-card">
      <p className="kc-chart-title">Defeitos por minuto</p>
      <div className="kc-chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="timestamp" hide />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip />
            <Bar dataKey="defectsPerMinute" fill="#f06060" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
