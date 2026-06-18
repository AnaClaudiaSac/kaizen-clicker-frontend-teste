import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatChartTooltipValue, type ChartPoint } from '../../engine/history'
import { formatChartLabel } from './tooltipFormatters'

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
            <Tooltip
              contentStyle={{ background: 'var(--kc-card)', border: '1px solid var(--kc-border)', borderRadius: '8px' }}
              labelStyle={{ color: 'var(--kc-text-muted)' }}
              itemStyle={{ color: 'var(--kc-text)' }}
              separator=": "
              labelFormatter={formatChartLabel}
              formatter={formatChartTooltipValue}
            />
            <Line
              type="monotone"
              dataKey="produced"
              name="Produção"
              stroke="#1db97a"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
