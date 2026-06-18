import { COST_GROWTH_RATE, INITIAL_FACTORY_STATS, MAX_PURCHASES_PER_UPGRADE, UPGRADE_EFFECTS } from './constants'
import type { FactoryStats, UpgradeId, UpgradePurchases } from './types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Custo da próxima compra de uma melhoria, com crescimento geométrico:
 * custo_n = custo_base × 1.5^n_compras (regra do desafio).
 */
export function getUpgradeCost(baseCost: number, purchasesSoFar: number): number {
  return Math.round(baseCost * Math.pow(COST_GROWTH_RATE, purchasesSoFar))
}

export function canPurchaseUpgrade(purchasesSoFar: number): boolean {
  return purchasesSoFar < MAX_PURCHASES_PER_UPGRADE
}

/**
 * Recalcula os indicadores da fábrica somando os efeitos de todas as
 * melhorias já compradas. Velocidade acumula como multiplicador sobre a
 * produção base; defeito e OEE acumulam como pontos percentuais sobre os
 * valores iniciais (ver decisão registrada na seção 5 do SPEC.md).
 */
export function calculateFactoryStats(purchases: UpgradePurchases): FactoryStats {
  let speedBonus = 0
  let defectReduction = 0
  let oeeBonus = 0

  for (const id of Object.keys(purchases) as UpgradeId[]) {
    const count = purchases[id]
    const effect = UPGRADE_EFFECTS[id]
    speedBonus += (effect.speedBonus ?? 0) * count
    defectReduction += (effect.defectReduction ?? 0) * count
    oeeBonus += (effect.oeeBonus ?? 0) * count
  }

  return {
    productionRate: INITIAL_FACTORY_STATS.productionRate * (1 + speedBonus),
    defectRate: clamp(INITIAL_FACTORY_STATS.defectRate - defectReduction, 0, 1),
    oee: clamp(INITIAL_FACTORY_STATS.oee + oeeBonus, 0, 1),
  }
}
