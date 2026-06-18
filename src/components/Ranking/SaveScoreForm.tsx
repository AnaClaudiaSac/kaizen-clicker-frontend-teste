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
    <form onSubmit={handleSubmit} className="flex gap-2 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={PLAYER_NAME_MAX_LENGTH}
        placeholder="Seu nome"
        aria-label="Nome do jogador"
        className="flex-1 rounded-md bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="shrink-0 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400"
      >
        Salvar pontuação
      </button>
    </form>
  )
}
