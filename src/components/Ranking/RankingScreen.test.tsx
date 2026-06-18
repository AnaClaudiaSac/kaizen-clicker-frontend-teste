import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../engine/constants'
import { useGameStore } from '../../store/useGameStore'
import { RankingScreen } from './RankingScreen'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
})

describe('RankingScreen', () => {
  it('mostra uma mensagem quando não há nenhuma pontuação salva', () => {
    render(<RankingScreen />)
    expect(screen.getByText('Nenhuma pontuação salva ainda.')).toBeInTheDocument()
  })

  it('lista as pontuações salvas em ordem decrescente', () => {
    useGameStore.setState({
      ranking: [
        { name: 'Bruno', score: 50, savedAt: 1 },
        { name: 'Ana', score: 200, savedAt: 2 },
      ],
    })
    render(<RankingScreen />)

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('1. Ana')
    expect(items[1]).toHaveTextContent('2. Bruno')
  })

  it('exibe apenas os 10 melhores quando há mais de 10 entradas', () => {
    const ranking = Array.from({ length: 15 }, (_, i) => ({ name: `Jogador${i}`, score: i, savedAt: i }))
    useGameStore.setState({ ranking })
    render(<RankingScreen />)

    expect(screen.getAllByRole('listitem')).toHaveLength(10)
  })
})
