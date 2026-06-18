import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

interface OeeGaugeProps {
  oee: number
}

export function OeeGauge({ oee }: OeeGaugeProps) {
  const percentage = Math.round(oee * 100)
  const data = [{ name: 'OEE', value: percentage, fill: '#60a5fa' }]

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-300">OEE</h3>
      <div className="relative h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" background cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <p className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-100">
          {percentage}%
        </p>
      </div>
    </div>
  )
}
