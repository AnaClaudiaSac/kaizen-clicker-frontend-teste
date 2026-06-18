import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../engine/constants'
import { useGameStore } from '../../store/useGameStore'
import { PieceAnimation } from './PieceAnimation'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
})

describe('PieceAnimation', () => {
  it('dispara uma nova animação cada vez que a produção total aumenta', () => {
    render(<PieceAnimation />)
    const before = screen.getByTestId('piece-animation').dataset.pulse

    act(() => {
      useGameStore.setState((state) => ({
        game: { ...state.game, totalProduced: state.game.totalProduced + 1 },
      }))
    })

    const after = screen.getByTestId('piece-animation').dataset.pulse
    expect(after).not.toBe(before)
  })

  it('não dispara nova animação quando a produção total não muda', () => {
    render(<PieceAnimation />)
    const before = screen.getByTestId('piece-animation').dataset.pulse

    act(() => {
      useGameStore.setState((state) => ({ game: { ...state.game } }))
    })

    const after = screen.getByTestId('piece-animation').dataset.pulse
    expect(after).toBe(before)
  })
})
