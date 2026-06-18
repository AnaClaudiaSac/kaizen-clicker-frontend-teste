import type { FactoryStats, UpgradeDefinition, UpgradeEffect, UpgradeId, UpgradePurchases } from './types'

export const TICK_MS = 1000
export const COST_GROWTH_RATE = 1.5
export const MAX_PURCHASES_PER_UPGRADE = 5
export const RANKING_TOP_COUNT = 10
export const RANKING_MAX_STORED_ENTRIES = 50
export const PLAYER_NAME_MAX_LENGTH = 20

export const INITIAL_FACTORY_STATS: FactoryStats = {
  productionRate: 1,
  defectRate: 0.3,
  oee: 0.4,
}

export const INITIAL_PURCHASES: UpgradePurchases = {
  '5s': 0,
  kanban: 0,
  pokaYoke: 0,
  tpm: 0,
  andon: 0,
  heijunka: 0,
}

export const UPGRADE_DEFINITIONS: UpgradeDefinition[] = [
  { id: '5s', name: '5S', baseCost: 50, description: '-5% defeito, +10% velocidade' },
  { id: 'kanban', name: 'Kanban', baseCost: 200, description: '+20% velocidade' },
  { id: 'pokaYoke', name: 'Poka-Yoke', baseCost: 500, description: '-15% defeito' },
  { id: 'tpm', name: 'TPM', baseCost: 1500, description: '+15% OEE, -10% defeito' },
  { id: 'andon', name: 'Andon', baseCost: 4000, description: '+5% OEE (auto-recovery em paradas)' },
  { id: 'heijunka', name: 'Heijunka', baseCost: 10000, description: '+25% OEE (nivela produção)' },
]

export const UPGRADE_EFFECTS: Record<UpgradeId, UpgradeEffect> = {
  '5s': { defectReduction: 0.05, speedBonus: 0.1 },
  kanban: { speedBonus: 0.2 },
  pokaYoke: { defectReduction: 0.15 },
  tpm: { oeeBonus: 0.15, defectReduction: 0.1 },
  andon: { oeeBonus: 0.05 },
  heijunka: { oeeBonus: 0.25 },
}
