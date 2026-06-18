import { describe, expect, it } from 'vitest'
import { INITIAL_PURCHASES } from '../constants'
import type { UpgradePurchases } from '../types'
import { calculateFactoryStats, canPurchaseUpgrade, getUpgradeCost } from '../upgrades'

describe('getUpgradeCost', () => {
  it('retorna o custo base quando ainda não houve nenhuma compra', () => {
    expect(getUpgradeCost(50, 0)).toBe(50)
  })

  it('aplica o crescimento geométrico de 1.5x por compra já realizada', () => {
    expect(getUpgradeCost(50, 1)).toBe(75)
    expect(getUpgradeCost(50, 2)).toBe(113)
    expect(getUpgradeCost(50, 3)).toBe(169)
    expect(getUpgradeCost(50, 4)).toBe(253)
  })

  it('funciona para custos base diferentes, como o do Kanban', () => {
    expect(getUpgradeCost(200, 0)).toBe(200)
    expect(getUpgradeCost(200, 1)).toBe(300)
  })
})

describe('canPurchaseUpgrade', () => {
  it('permite compra enquanto não atingiu o limite de 5', () => {
    expect(canPurchaseUpgrade(0)).toBe(true)
    expect(canPurchaseUpgrade(4)).toBe(true)
  })

  it('bloqueia a compra ao atingir o limite de 5', () => {
    expect(canPurchaseUpgrade(5)).toBe(false)
  })
})

describe('calculateFactoryStats', () => {
  it('retorna os indicadores iniciais quando nenhuma melhoria foi comprada', () => {
    const stats = calculateFactoryStats(INITIAL_PURCHASES)
    expect(stats).toEqual({ productionRate: 1, defectRate: 0.3, oee: 0.4 })
  })

  it('aplica o efeito do 5S: -5% defeito e +10% velocidade por compra', () => {
    const purchases: UpgradePurchases = { ...INITIAL_PURCHASES, '5s': 1 }
    const stats = calculateFactoryStats(purchases)
    expect(stats.productionRate).toBeCloseTo(1.1)
    expect(stats.defectRate).toBeCloseTo(0.25)
  })

  it('acumula efeitos de múltiplas compras da mesma melhoria', () => {
    const purchases: UpgradePurchases = { ...INITIAL_PURCHASES, '5s': 2 }
    const stats = calculateFactoryStats(purchases)
    expect(stats.productionRate).toBeCloseTo(1.2)
    expect(stats.defectRate).toBeCloseTo(0.2)
  })

  it('acumula efeitos de melhorias diferentes simultaneamente', () => {
    const purchases: UpgradePurchases = { ...INITIAL_PURCHASES, '5s': 1, kanban: 1 }
    const stats = calculateFactoryStats(purchases)
    // velocidade: 1 * (1 + 0.10 + 0.20) = 1.30
    expect(stats.productionRate).toBeCloseTo(1.3)
  })

  it('nunca deixa a taxa de defeito abaixo de zero', () => {
    const purchases: UpgradePurchases = { ...INITIAL_PURCHASES, '5s': 5, pokaYoke: 5, tpm: 5 }
    const stats = calculateFactoryStats(purchases)
    expect(stats.defectRate).toBe(0)
  })

  it('nunca deixa o OEE acima de 1 (100%)', () => {
    const purchases: UpgradePurchases = { ...INITIAL_PURCHASES, tpm: 5, andon: 5, heijunka: 5 }
    const stats = calculateFactoryStats(purchases)
    expect(stats.oee).toBe(1)
  })
})
