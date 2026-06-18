export type UpgradeId = '5s' | 'kanban' | 'pokaYoke' | 'tpm' | 'andon' | 'heijunka'

export interface UpgradeDefinition {
  id: UpgradeId
  name: string
  baseCost: number
  description: string
}

export interface UpgradeEffect {
  /** Soma ao multiplicador de velocidade de produção, ex: 0.10 = +10% */
  speedBonus?: number
  /** Pontos percentuais subtraídos da taxa de defeito, ex: 0.05 = -5pp */
  defectReduction?: number
  /** Pontos percentuais somados ao OEE, ex: 0.15 = +15pp */
  oeeBonus?: number
}

export type UpgradePurchases = Record<UpgradeId, number>

export interface FactoryStats {
  /** Peças por segundo, já com bônus de velocidade aplicados */
  productionRate: number
  /** Taxa de defeito, de 0 a 1 */
  defectRate: number
  /** OEE, de 0 a 1 */
  oee: number
}

export interface HistoryPoint {
  timestamp: number
  produced: number
  defects: number
  oee: number
}

export interface GameState {
  points: number
  totalProduced: number
  totalDefects: number
  purchases: UpgradePurchases
  lastTickTimestamp: number
  history: HistoryPoint[]
}

export interface RankingEntry {
  name: string
  score: number
  savedAt: number
}
