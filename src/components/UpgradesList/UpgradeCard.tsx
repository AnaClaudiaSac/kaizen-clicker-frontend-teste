interface UpgradeCardProps {
  name: string
  description: string
  cost: number
  purchasesSoFar: number
  maxPurchases: number
  canAfford: boolean
  onBuy: () => void
}

export function UpgradeCard({
  name,
  description,
  cost,
  purchasesSoFar,
  maxPurchases,
  canAfford,
  onBuy,
}: UpgradeCardProps) {
  const maxed = purchasesSoFar >= maxPurchases
  const disabled = maxed || !canAfford

  return (
    <div className={`kc-item ${canAfford && !maxed ? 'affordable' : ''}`}>
      <div className="kc-item-info">
        <p className="kc-item-name">{name}</p>
        <p className="kc-item-effect">{description}</p>
        <p className="kc-item-count">
          {purchasesSoFar}/{maxPurchases} compradas
        </p>
      </div>
      <button type="button" onClick={onBuy} disabled={disabled} className="kc-item-btn">
        {maxed ? 'Máximo' : `${cost} pts`}
      </button>
    </div>
  )
}
