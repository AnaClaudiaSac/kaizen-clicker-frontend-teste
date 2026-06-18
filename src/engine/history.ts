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
