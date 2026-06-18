import { describe, expect, it } from 'vitest'
import { formatChartTimestamp, formatChartTooltipValue, toChartPoints } from '../history'
import type { HistoryPoint } from '../types'

describe('toChartPoints', () => {
  it('retorna lista vazia quando não há histórico', () => {
    expect(toChartPoints([])).toEqual([])
  })

  it('usa defectsPerMinute zero no primeiro ponto, sem ponto anterior para comparar', () => {
    const history: HistoryPoint[] = [{ timestamp: 1000, produced: 10, defects: 3, oee: 0.4 }]
    const [point] = toChartPoints(history)
    expect(point.defectsPerMinute).toBe(0)
    expect(point.produced).toBe(10)
    expect(point.oee).toBe(0.4)
  })

  it('calcula a taxa de defeitos por minuto a partir da diferença entre pontos consecutivos', () => {
    const history: HistoryPoint[] = [
      { timestamp: 0, produced: 0, defects: 0, oee: 0.4 },
      { timestamp: 10_000, produced: 7, defects: 3, oee: 0.4 }, // 3 defeitos em 10s = 18/min
    ]
    const [, second] = toChartPoints(history)
    expect(second.defectsPerMinute).toBeCloseTo(18)
  })

  it('retorna zero quando dois pontos têm o mesmo timestamp (evita divisão por zero)', () => {
    const history: HistoryPoint[] = [
      { timestamp: 1000, produced: 0, defects: 0, oee: 0.4 },
      { timestamp: 1000, produced: 1, defects: 1, oee: 0.4 },
    ]
    const [, second] = toChartPoints(history)
    expect(second.defectsPerMinute).toBe(0)
  })
})

describe('formatChartTooltipValue', () => {
  it('arredonda valores numéricos para 2 casas decimais', () => {
    expect(formatChartTooltipValue(18.000000000000014)).toBe('18.00')
  })

  it('mantém valores que não são número (string) inalterados', () => {
    expect(formatChartTooltipValue('n/a')).toBe('n/a')
  })

  it('mantém undefined inalterado', () => {
    expect(formatChartTooltipValue(undefined)).toBeUndefined()
  })
})

describe('formatChartTimestamp', () => {
  it('formata um timestamp como horário local HH:MM:SS', () => {
    const timestamp = new Date(2024, 0, 1, 14, 5, 9).getTime()
    expect(formatChartTimestamp(timestamp)).toBe('14:05:09')
  })

  it('preenche horas, minutos e segundos com zero à esquerda', () => {
    const timestamp = new Date(2024, 0, 1, 1, 2, 3).getTime()
    expect(formatChartTimestamp(timestamp)).toBe('01:02:03')
  })

  it('aceita o timestamp como string (vindo do label do gráfico)', () => {
    const timestamp = new Date(2024, 0, 1, 9, 30, 0).getTime()
    expect(formatChartTimestamp(String(timestamp))).toBe('09:30:00')
  })
})
