import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../engine/constants'
import { useGameStore } from '../../store/useGameStore'
import { UpgradesList } from './UpgradesList'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
})

describe('UpgradesList', () => {
  it('desabilita a compra do 5S quando não há pontos suficientes', () => {
    render(<UpgradesList />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
  })

  it('compra o 5S e debita o custo da store ao clicar no botão habilitado', () => {
    useGameStore.setState((state) => ({ game: { ...state.game, points: 100 } }))
    render(<UpgradesList />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])

    const { game } = useGameStore.getState()
    expect(game.purchases['5s']).toBe(1)
    expect(game.points).toBe(50)
  })
})
