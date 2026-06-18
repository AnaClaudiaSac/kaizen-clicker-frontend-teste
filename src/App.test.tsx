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

  it('abre o modal de confirmação ao clicar em Reiniciar, e reinicia o jogo ao confirmar', () => {
    useGameStore.setState((state) => ({ game: { ...state.game, points: 500 } }))

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }))
    expect(screen.getByText('Reiniciar jogo')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Sim, reiniciar' }))

    expect(useGameStore.getState().game.points).toBe(0)
    expect(screen.queryByText('Reiniciar jogo')).not.toBeInTheDocument()
  })

  it('não reinicia o jogo quando o usuário cancela no modal', () => {
    useGameStore.setState((state) => ({ game: { ...state.game, points: 500 } }))

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(useGameStore.getState().game.points).toBe(500)
    expect(screen.queryByText('Reiniciar jogo')).not.toBeInTheDocument()
  })
})
