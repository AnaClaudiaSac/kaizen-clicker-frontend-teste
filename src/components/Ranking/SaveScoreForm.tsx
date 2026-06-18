import { useState, type FormEvent } from 'react'
import { PLAYER_NAME_MAX_LENGTH } from '../../engine/constants'
import { useGameStore } from '../../store/useGameStore'

export function SaveScoreForm() {
  const [name, setName] = useState('')
  const saveScore = useGameStore((state) => state.saveScore)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    saveScore(name)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="kc-panel" style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={PLAYER_NAME_MAX_LENGTH}
        placeholder="Seu nome"
        aria-label="Nome do jogador"
        className="flex-1 rounded-md bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400"
      />
      <button type="submit" disabled={!name.trim()} className="kc-item-btn">
        Salvar pontuação
      </button>
    </form>
  )
}
