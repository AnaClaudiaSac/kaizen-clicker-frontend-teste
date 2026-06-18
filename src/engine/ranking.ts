import { PLAYER_NAME_MAX_LENGTH, RANKING_MAX_STORED_ENTRIES, RANKING_TOP_COUNT } from './constants'
import type { RankingEntry } from './types'

export function sanitizePlayerName(name: string): string {
  return name.trim().slice(0, PLAYER_NAME_MAX_LENGTH)
}

/**
 * Insere ou atualiza uma entrada do ranking: nome novo sempre entra; nome
 * já existente só é atualizado se o novo score for maior que o salvo
 * (Regra 3 do desafio). A lista resultante fica limitada a
 * RANKING_MAX_STORED_ENTRIES, mantendo as maiores pontuações, para evitar
 * crescimento ilimitado do localStorage.
 */
export function upsertRankingEntry(ranking: RankingEntry[], newEntry: RankingEntry): RankingEntry[] {
  const existingIndex = ranking.findIndex((entry) => entry.name === newEntry.name)

  let updated: RankingEntry[]
  if (existingIndex === -1) {
    updated = [...ranking, newEntry]
  } else if (newEntry.score > ranking[existingIndex].score) {
    updated = [...ranking]
    updated[existingIndex] = newEntry
  } else {
    return ranking
  }

  return updated.sort((a, b) => b.score - a.score).slice(0, RANKING_MAX_STORED_ENTRIES)
}

export function getTopRanking(ranking: RankingEntry[]): RankingEntry[] {
  return [...ranking].sort((a, b) => b.score - a.score).slice(0, RANKING_TOP_COUNT)
}
