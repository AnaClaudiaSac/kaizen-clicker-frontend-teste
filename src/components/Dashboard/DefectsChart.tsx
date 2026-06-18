import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatChartTooltipValue, type ChartPoint } from '../../engine/history'
import { formatChartLabel } from './tooltipFormatters'

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
            <Tooltip
              contentStyle={{ background: 'var(--kc-card)', border: '1px solid var(--kc-border)', borderRadius: '8px' }}
              labelStyle={{ color: 'var(--kc-text-muted)' }}
              itemStyle={{ color: 'var(--kc-text)' }}
              separator=": "
              labelFormatter={formatChartLabel}
              formatter={formatChartTooltipValue}
            />
            <Bar dataKey="defectsPerMinute" name="Defeitos/min" fill="#f06060" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
