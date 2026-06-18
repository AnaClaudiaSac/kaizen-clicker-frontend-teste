import type { GameState, RankingEntry, UpgradePurchases } from './types'

const RANKING_KEY = 'kaizen-clicker:ranking'
const SAVE_KEY = 'kaizen-clicker:save'

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // localStorage indisponível (ex.: modo privado sem suporte) — falha
    // silenciosamente, o jogo continua funcionando sem persistência.
  }
}

function safeParse(raw: string | null): unknown {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isRankingEntry(value: unknown): value is RankingEntry {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return typeof entry.name === 'string' && typeof entry.score === 'number' && typeof entry.savedAt === 'number'
}

export function loadRanking(): RankingEntry[] {
  const parsed = safeParse(readRaw(RANKING_KEY))
  if (!Array.isArray(parsed)) return []
  return parsed.filter(isRankingEntry)
}

export function saveRanking(ranking: RankingEntry[]): void {
  writeRaw(RANKING_KEY, JSON.stringify(ranking))
}

function isUpgradePurchases(value: unknown): value is UpgradePurchases {
  if (typeof value !== 'object' || value === null) return false
  return Object.values(value as Record<string, unknown>).every((count) => typeof count === 'number')
}

function isGameState(value: unknown): value is GameState {
  if (typeof value !== 'object' || value === null) return false
  const state = value as Record<string, unknown>
  return (
    typeof state.points === 'number' &&
    typeof state.totalProduced === 'number' &&
    typeof state.totalDefects === 'number' &&
    typeof state.lastTickTimestamp === 'number' &&
    Array.isArray(state.history) &&
    isUpgradePurchases(state.purchases)
  )
}

export function loadGameState(): GameState | null {
  const parsed = safeParse(readRaw(SAVE_KEY))
  return isGameState(parsed) ? parsed : null
}

export function saveGameState(state: GameState): void {
  writeRaw(SAVE_KEY, JSON.stringify(state))
}
