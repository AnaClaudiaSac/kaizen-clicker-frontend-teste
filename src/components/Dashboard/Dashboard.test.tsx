import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../engine/constants'
import { useGameStore } from '../../store/useGameStore'
import { Dashboard } from './Dashboard'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
})

describe('Dashboard', () => {
  it('renderiza os três indicadores: produção, defeitos e OEE', () => {
    render(<Dashboard />)
    expect(screen.getByText('Produção acumulada')).toBeInTheDocument()
    expect(screen.getByText('Defeitos por minuto')).toBeInTheDocument()
    expect(screen.getByText('OEE')).toBeInTheDocument()
  })

  it('mostra o percentual de OEE inicial (40%)', () => {
    render(<Dashboard />)
    expect(screen.getByText('40%')).toBeInTheDocument()
  })
})
