import type { HistoryPoint } from './types'

export interface ChartPoint {
  timestamp: number
  produced: number
  defectsPerMinute: number
  oee: number
}

/**
 * Converte o histórico acumulado (produced/defects sempre crescentes) em
 * pontos prontos para os gráficos do dashboard, calculando a taxa de
 * defeitos por minuto a partir da diferença entre pontos consecutivos —
 * o histórico guarda totais acumulados, não a taxa diretamente.
 */
export function toChartPoints(history: HistoryPoint[]): ChartPoint[] {
  return history.map((point, index) => {
    if (index === 0) {
      return { timestamp: point.timestamp, produced: point.produced, defectsPerMinute: 0, oee: point.oee }
    }

    const previous = history[index - 1]
    const deltaDefects = point.defects - previous.defects
    const deltaSeconds = (point.timestamp - previous.timestamp) / 1000
    const defectsPerMinute = deltaSeconds > 0 ? (deltaDefects / deltaSeconds) * 60 : 0

    return { timestamp: point.timestamp, produced: point.produced, defectsPerMinute, oee: point.oee }
  })
}

/**
 * Arredonda o valor exibido no tooltip dos gráficos para 2 casas decimais,
 * evitando imprecisão de ponto flutuante (ex.: 18.000000000000014).
 */
export function formatChartTooltipValue(value: number | string | readonly (number | string)[] | undefined) {
  return typeof value === 'number' ? value.toFixed(2) : value
}

/**
 * Formata o timestamp (epoch ms) exibido no tooltip dos gráficos como
 * horário local legível (HH:MM:SS), em vez do número cru.
 */
export function formatChartTimestamp(timestamp: number | string): string {
  const date = new Date(Number(timestamp))
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
