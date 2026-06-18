import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

interface OeeGaugeProps {
  oee: number
}

export function OeeGauge({ oee }: OeeGaugeProps) {
  const percentage = Math.round(oee * 100)
  const data = [{ name: 'OEE', value: percentage, fill: '#1db97a' }]

  return (
    <div className="kc-oee-card">
      <p className="kc-chart-title">OEE</p>
      <div className="kc-oee-ring-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={data} innerRadius="65%" outerRadius="95%" startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" background={{ fill: '#1a3348' }} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <p className="kc-oee-pct">{percentage}%</p>
      </div>
    </div>
  )
}
