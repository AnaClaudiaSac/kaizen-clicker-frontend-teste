import { describe, expect, it } from 'vitest'
import { formatChartLabel } from './tooltipFormatters'

describe('formatChartLabel', () => {
  it('formata um label numérico (timestamp) como horário local', () => {
    const timestamp = new Date(2024, 0, 1, 14, 5, 9).getTime()
    expect(formatChartLabel(timestamp)).toBe('14:05:09')
  })

  it('formata um label em string (timestamp serializado)', () => {
    const timestamp = new Date(2024, 0, 1, 9, 30, 0).getTime()
    expect(formatChartLabel(String(timestamp))).toBe('09:30:00')
  })

  it('retorna string vazia quando o label não é number nem string', () => {
    expect(formatChartLabel(null)).toBe('')
    expect(formatChartLabel(undefined)).toBe('')
  })
})
