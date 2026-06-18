import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { createInitialGameState } from './engine/constants'
import { useGameStore } from './store/useGameStore'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
})

describe('App', () => {
  it('renderiza o título do jogo e a tela principal por padrão', () => {
    render(<App />)
    expect(screen.getByText('Kaizen Clicker')).toBeInTheDocument()
    expect(screen.getByText('Pontos Kaizen')).toBeInTheDocument()
  })

  it('alterna para a tela de Ranking ao clicar no botão correspondente', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ranking' }))
    expect(screen.getByText('Nenhuma pontuação salva ainda.')).toBeInTheDocument()
  })

  it('volta para a tela do Jogo ao clicar no botão correspondente', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ranking' }))
    fireEvent.click(screen.getByRole('button', { name: 'Jogo' }))
    expect(screen.getByText('Pontos Kaizen')).toBeInTheDocument()
  })
})
