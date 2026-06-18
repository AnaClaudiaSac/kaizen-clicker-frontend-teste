import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../engine/constants'
import { useGameStore } from '../../store/useGameStore'
import { SaveScoreForm } from './SaveScoreForm'

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
})

describe('SaveScoreForm', () => {
  it('mantém o botão de salvar desabilitado enquanto o nome está vazio', () => {
    render(<SaveScoreForm />)
    expect(screen.getByRole('button', { name: 'Salvar pontuação' })).toBeDisabled()
  })

  it('salva a pontuação na store ao submeter com um nome válido', () => {
    useGameStore.setState((state) => ({ game: { ...state.game, totalProduced: 123 } }))
    render(<SaveScoreForm />)

    fireEvent.change(screen.getByLabelText('Nome do jogador'), { target: { value: 'Ana' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar pontuação' }))

    const { ranking } = useGameStore.getState()
    expect(ranking).toEqual([{ name: 'Ana', score: 123, savedAt: expect.any(Number) }])
  })

  it('limpa o campo de nome após salvar', () => {
    render(<SaveScoreForm />)
    const input = screen.getByLabelText('Nome do jogador') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'Ana' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar pontuação' }))

    expect(input.value).toBe('')
  })
})
