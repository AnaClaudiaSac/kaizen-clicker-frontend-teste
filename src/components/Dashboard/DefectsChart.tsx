import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChartPoint } from '../../engine/history'

interface DefectsChartProps {
  data: ChartPoint[]
}

export function DefectsChart({ data }: DefectsChartProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-300">Defeitos por minuto</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data}>
          <XAxis dataKey="timestamp" hide />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip />
          <Bar dataKey="defectsPerMinute" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
