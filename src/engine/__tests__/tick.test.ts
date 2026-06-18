import { describe, expect, it } from 'vitest'
import { INITIAL_PURCHASES, TICK_MS } from '../constants'
import { advanceTicks, applyTick } from '../tick'
import type { FactoryStats, GameState } from '../types'

const stats: FactoryStats = { productionRate: 1, defectRate: 0.3, oee: 0.4 }

describe('advanceTicks', () => {
  it('não avança nada quando o tempo decorrido é menor que um tick', () => {
    const result = advanceTicks(1000, 1500, stats)
    expect(result).toEqual({ ticksElapsed: 0, goodPieces: 0, defectivePieces: 0 })
  })

  it('avança exatamente 1 tick quando passa 1 segundo', () => {
    const result = advanceTicks(0, TICK_MS, stats)
    expect(result.ticksElapsed).toBe(1)
    expect(result.goodPieces).toBeCloseTo(0.7)
    expect(result.defectivePieces).toBeCloseTo(0.3)
  })

  it('aplica a Regra 2: 5 minutos em background equivalem a 300 ticks', () => {
    const fiveMinutesMs = 5 * 60 * 1000
    const result = advanceTicks(0, fiveMinutesMs, stats)
    expect(result.ticksElapsed).toBe(300)
  })

  it('considera apenas ticks completos, descartando fração de segundo', () => {
    const result = advanceTicks(0, 2500, stats)
    expect(result.ticksElapsed).toBe(2)
  })

  it('escala a produção de acordo com a taxa de produção da fábrica', () => {
    const fastStats: FactoryStats = { productionRate: 2, defectRate: 0, oee: 0.4 }
    const result = advanceTicks(0, 3000, fastStats)
    expect(result.ticksElapsed).toBe(3)
    expect(result.goodPieces).toBeCloseTo(6)
    expect(result.defectivePieces).toBe(0)
  })
})

describe('applyTick', () => {
  const baseState: GameState = {
    points: 0,
    totalProduced: 0,
    totalDefects: 0,
    purchases: INITIAL_PURCHASES,
    lastTickTimestamp: 0,
    history: [],
  }

  it('retorna o mesmo estado quando nenhum tick se completou', () => {
    const result = applyTick(baseState, 500, stats)
    expect(result).toBe(baseState)
  })

  it('soma os pontos produzidos ao estado e registra um ponto no histórico', () => {
    const result = applyTick(baseState, TICK_MS, stats)
    expect(result.points).toBeCloseTo(0.7)
    expect(result.totalProduced).toBeCloseTo(0.7)
    expect(result.totalDefects).toBeCloseTo(0.3)
    expect(result.history).toHaveLength(1)
  })

  it('avança lastTickTimestamp em múltiplos exatos de TICK_MS, preservando o resto', () => {
    const result = applyTick(baseState, 2500, stats)
    // 2 ticks completos (2000ms); os 500ms restantes ficam para a próxima chamada
    expect(result.lastTickTimestamp).toBe(2000)
  })

  it('não muta o estado original (função pura)', () => {
    const result = applyTick(baseState, TICK_MS, stats)
    expect(baseState.points).toBe(0)
    expect(result).not.toBe(baseState)
  })
})
