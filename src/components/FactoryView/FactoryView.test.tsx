import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../engine/constants'
import { useGameStore } from '../../store/useGameStore'
import { FactoryView } from './FactoryView'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
})

describe('FactoryView', () => {
  it('mostra o saldo de pontos arredondado', () => {
    useGameStore.setState((state) => ({ game: { ...state.game, points: 42.9 } }))
    render(<FactoryView />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('mostra os indicadores iniciais da fábrica (produção, defeito, OEE)', () => {
    render(<FactoryView />)
    expect(screen.getByText('1.00/s')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
  })
})
