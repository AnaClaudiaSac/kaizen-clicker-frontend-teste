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
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <div>
        <h3 className="font-semibold text-slate-100">{name}</h3>
        <p className="text-sm text-slate-400">{description}</p>
        <p className="text-xs text-slate-500">
          {purchasesSoFar}/{maxPurchases} compradas
        </p>
      </div>
      <button
        type="button"
        onClick={onBuy}
        disabled={disabled}
        className="shrink-0 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400"
      >
        {maxed ? 'Máximo' : `Comprar (${cost} pts)`}
      </button>
    </div>
  )
}
