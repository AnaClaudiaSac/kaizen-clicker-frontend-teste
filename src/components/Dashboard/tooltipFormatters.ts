import type { ReactNode } from 'react'
import { formatChartTimestamp } from '../../engine/history'

/**
 * Adapta o label do tooltip do Recharts (tipado como ReactNode) para o
 * formato number | string esperado por formatChartTimestamp, sem recorrer
 * a `unknown` na função pura do engine.
 */
export function formatChartLabel(label: ReactNode): string {
  return typeof label === 'number' || typeof label === 'string' ? formatChartTimestamp(label) : ''
}
