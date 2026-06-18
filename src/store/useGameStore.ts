import { create } from 'zustand'
import { createInitialGameState, UPGRADE_DEFINITIONS } from '../engine/constants'
import { loadGameState, loadRanking, saveGameState, saveRanking } from '../engine/persistence'
import { sanitizePlayerName, upsertRankingEntry } from '../engine/ranking'
import { applyTick } from '../engine/tick'
import type { GameState, RankingEntry, UpgradeId } from '../engine/types'
import { calculateFactoryStats, canPurchaseUpgrade, getUpgradeCost } from '../engine/upgrades'

interface GameStore {
  game: GameState
  ranking: RankingEntry[]
  /** Nome usado na última vez que o jogador salvou pontuação nesta sessão, usado para destacar "você" no ranking. */
  lastSavedPlayerName: string | null
  tick: (now: number) => void
  purchaseUpgrade: (id: UpgradeId) => void
  saveScore: (name: string) => void
}

function loadOrCreateInitialState(): GameState {
  return loadGameState() ?? createInitialGameState(Date.now())
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: loadOrCreateInitialState(),
  ranking: loadRanking(),
  lastSavedPlayerName: null,

  tick: (now) => {
    const { game } = get()
    const stats = calculateFactoryStats(game.purchases)
    const nextGame = applyTick(game, now, stats)
    if (nextGame === game) return

    set({ game: nextGame })
    saveGameState(nextGame)
  },

  purchaseUpgrade: (id) => {
    const { game } = get()
    const purchasesSoFar = game.purchases[id]
    if (!canPurchaseUpgrade(purchasesSoFar)) return

    const definition = UPGRADE_DEFINITIONS.find((upgrade) => upgrade.id === id)
    if (!definition) return

    const cost = getUpgradeCost(definition.baseCost, purchasesSoFar)
    if (game.points < cost) return

    const nextGame: GameState = {
      ...game,
      points: game.points - cost,
      purchases: { ...game.purchases, [id]: purchasesSoFar + 1 },
    }
    set({ game: nextGame })
    saveGameState(nextGame)
  },

  saveScore: (name) => {
    const sanitized = sanitizePlayerName(name)
    if (!sanitized) return

    const { game, ranking } = get()
    // "Pontuação total" é a produção acumulada (totalProduced), não o saldo
    // de pontos disponíveis (points) — assim, comprar melhorias nunca
    // reduz a pontuação salva no ranking.
    const score = Math.round(game.totalProduced)
    const nextRanking = upsertRankingEntry(ranking, { name: sanitized, score, savedAt: Date.now() })

    set({ ranking: nextRanking, lastSavedPlayerName: sanitized })
    saveRanking(nextRanking)
  },
}))
