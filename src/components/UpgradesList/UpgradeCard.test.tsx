import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UpgradeCard } from './UpgradeCard'

const baseProps = {
  name: '5S',
  description: '-5% defeito, +10% velocidade',
  cost: 50,
  purchasesSoFar: 0,
  maxPurchases: 5,
}

describe('UpgradeCard', () => {
  it('habilita o botão de compra quando há pontos suficientes', () => {
    render(<UpgradeCard {...baseProps} canAfford={true} onBuy={vi.fn()} />)
    expect(screen.getByRole('button')).toBeEnabled()
  })

  it('desabilita o botão de compra quando não há pontos suficientes', () => {
    render(<UpgradeCard {...baseProps} canAfford={false} onBuy={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('desabilita o botão e mostra "Máximo" ao atingir o limite de compras', () => {
    render(<UpgradeCard {...baseProps} purchasesSoFar={5} canAfford={true} onBuy={vi.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText('Máximo')).toBeInTheDocument()
  })

  it('chama onBuy ao clicar no botão habilitado', () => {
    const onBuy = vi.fn()
    render(<UpgradeCard {...baseProps} canAfford={true} onBuy={onBuy} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onBuy).toHaveBeenCalledOnce()
  })
})
