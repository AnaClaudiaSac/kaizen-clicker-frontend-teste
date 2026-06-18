import { TICK_MS } from './constants'
import type { FactoryStats, GameState } from './types'

export interface TickResult {
  ticksElapsed: number
  goodPieces: number
  defectivePieces: number
}

/**
 * Calcula quanto a fábrica produziu entre dois instantes a partir do tempo
 * real decorrido, não da contagem de disparos de um timer. Essa abordagem
 * resolve as Regras 1 e 2 do desafio ao mesmo tempo: o tickrate fica
 * desacoplado do ciclo de render do React (Regra 1) e independe de o
 * navegador atrasar ou pausar o `setInterval` enquanto a aba está em
 * segundo plano (Regra 2) — ao retomar, o tempo real decorrido é aplicado
 * de uma vez, em vez de depender de quantas vezes o timer disparou.
 */
export function advanceTicks(lastTimestamp: number, now: number, stats: FactoryStats): TickResult {
  const ticksElapsed = Math.floor((now - lastTimestamp) / TICK_MS)
  if (ticksElapsed <= 0) {
    return { ticksElapsed: 0, goodPieces: 0, defectivePieces: 0 }
  }

  const totalPieces = ticksElapsed * stats.productionRate
  const defectivePieces = totalPieces * stats.defectRate
  const goodPieces = totalPieces - defectivePieces

  return { ticksElapsed, goodPieces, defectivePieces }
}

/**
 * Aplica o avanço de ticks a um GameState, retornando um novo estado
 * (função pura, não muta o estado recebido). `lastTickTimestamp` avança
 * em múltiplos exatos de TICK_MS — não para o valor de `now` — para não
 * perder a fração de segundo ainda não completada na próxima chamada.
 */
export function applyTick(state: GameState, now: number, stats: FactoryStats): GameState {
  const { ticksElapsed, goodPieces, defectivePieces } = advanceTicks(state.lastTickTimestamp, now, stats)

  if (ticksElapsed === 0) {
    return state
  }

  const totalProduced = state.totalProduced + goodPieces
  const totalDefects = state.totalDefects + defectivePieces

  return {
    ...state,
    points: state.points + goodPieces,
    totalProduced,
    totalDefects,
    lastTickTimestamp: state.lastTickTimestamp + ticksElapsed * TICK_MS,
    history: [...state.history, { timestamp: now, produced: totalProduced, defects: totalDefects, oee: stats.oee }],
  }
}
