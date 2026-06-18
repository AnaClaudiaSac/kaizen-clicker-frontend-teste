import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../engine/constants'
import { useGameStore } from '../useGameStore'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
})

describe('purchaseUpgrade', () => {
  it('não compra quando não há pontos suficientes', () => {
    useGameStore.getState().purchaseUpgrade('5s')
    expect(useGameStore.getState().game.purchases['5s']).toBe(0)
  })

  it('debita o custo e incrementa a contagem de compras quando há pontos suficientes', () => {
    useGameStore.setState((state) => ({ game: { ...state.game, points: 100 } }))
    useGameStore.getState().purchaseUpgrade('5s')

    const { game } = useGameStore.getState()
    expect(game.purchases['5s']).toBe(1)
    expect(game.points).toBe(50) // 100 - custo base do 5S (50, sem compras anteriores)
  })

  it('bloqueia novas compras ao atingir o limite de 5', () => {
    useGameStore.setState((state) => ({
      game: { ...state.game, points: 1_000_000, purchases: { ...state.game.purchases, '5s': 5 } },
    }))
    useGameStore.getState().purchaseUpgrade('5s')
    expect(useGameStore.getState().game.purchases['5s']).toBe(5)
  })
})

describe('saveScore', () => {
  it('salva a pontuação usando a produção total acumulada, não o saldo de pontos', () => {
    useGameStore.setState((state) => ({ game: { ...state.game, points: 10, totalProduced: 250 } }))
    useGameStore.getState().saveScore('Ana')

    const { ranking } = useGameStore.getState()
    expect(ranking).toEqual([{ name: 'Ana', score: 250, savedAt: expect.any(Number) }])
  })

  it('ignora nomes vazios (após trim)', () => {
    useGameStore.getState().saveScore('   ')
    expect(useGameStore.getState().ranking).toEqual([])
  })
})

describe('tick', () => {
  it('não altera o estado quando nenhum tick completo se passou', () => {
    const before = useGameStore.getState().game
    useGameStore.getState().tick(before.lastTickTimestamp + 500)
    expect(useGameStore.getState().game).toBe(before)
  })

  it('avança pontos e produção quando um tick completo se passa', () => {
    const before = useGameStore.getState().game
    useGameStore.getState().tick(before.lastTickTimestamp + 1000)
    const { game } = useGameStore.getState()
    expect(game.points).toBeGreaterThan(0)
    expect(game.totalProduced).toBeGreaterThan(0)
  })
})
