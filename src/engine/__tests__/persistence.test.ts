import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState, INITIAL_PURCHASES } from '../constants'
import { loadGameState, loadRanking, saveGameState, saveRanking } from '../persistence'
import type { RankingEntry } from '../types'

const RANKING_KEY = 'kaizen-clicker:ranking'
const SAVE_KEY = 'kaizen-clicker:save'

beforeEach(() => {
  localStorage.clear()
})

describe('ranking: loadRanking / saveRanking', () => {
  it('retorna lista vazia quando não há nada salvo', () => {
    expect(loadRanking()).toEqual([])
  })

  it('salva e recupera o ranking corretamente', () => {
    const ranking: RankingEntry[] = [{ name: 'Ana', score: 100, savedAt: 1 }]
    saveRanking(ranking)
    expect(loadRanking()).toEqual(ranking)
  })

  it('retorna lista vazia quando o JSON salvo está corrompido', () => {
    localStorage.setItem(RANKING_KEY, '{not-valid-json')
    expect(loadRanking()).toEqual([])
  })

  it('descarta entradas com formato inválido, mantendo as válidas', () => {
    localStorage.setItem(
      RANKING_KEY,
      JSON.stringify([
        { name: 'Ana', score: 100, savedAt: 1 },
        { name: 'Invalida', score: 'nao-e-numero' },
      ])
    )
    expect(loadRanking()).toEqual([{ name: 'Ana', score: 100, savedAt: 1 }])
  })

  it('retorna lista vazia quando o valor salvo não é um array', () => {
    localStorage.setItem(RANKING_KEY, JSON.stringify({ não: 'é um array' }))
    expect(loadRanking()).toEqual([])
  })
})

describe('save do jogo: loadGameState / saveGameState', () => {
  it('retorna null quando não há save salvo', () => {
    expect(loadGameState()).toBeNull()
  })

  it('salva e recupera o estado do jogo corretamente', () => {
    const state = createInitialGameState(1000)
    state.points = 42
    saveGameState(state)
    expect(loadGameState()).toEqual(state)
  })

  it('retorna null quando o formato salvo é inválido (ex.: points não é número)', () => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        points: 'quarenta e dois',
        totalProduced: 0,
        totalDefects: 0,
        purchases: INITIAL_PURCHASES,
        lastTickTimestamp: 0,
        history: [],
      })
    )
    expect(loadGameState()).toBeNull()
  })

  it('retorna null quando o JSON salvo está corrompido', () => {
    localStorage.setItem(SAVE_KEY, '{not-valid-json')
    expect(loadGameState()).toBeNull()
  })
})
