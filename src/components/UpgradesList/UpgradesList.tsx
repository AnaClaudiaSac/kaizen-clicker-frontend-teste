import { MAX_PURCHASES_PER_UPGRADE, UPGRADE_DEFINITIONS } from '../../engine/constants'
import { getUpgradeCost } from '../../engine/upgrades'
import { useGameStore } from '../../store/useGameStore'
import { UpgradeCard } from './UpgradeCard'

export function UpgradesList() {
  const game = useGameStore((state) => state.game)
  const purchaseUpgrade = useGameStore((state) => state.purchaseUpgrade)

  return (
    <div className="flex flex-col gap-3">
      {UPGRADE_DEFINITIONS.map((upgrade) => {
        const purchasesSoFar = game.purchases[upgrade.id]
        const cost = getUpgradeCost(upgrade.baseCost, purchasesSoFar)

        return (
          <UpgradeCard
            key={upgrade.id}
            name={upgrade.name}
            description={upgrade.description}
            cost={cost}
            purchasesSoFar={purchasesSoFar}
            maxPurchases={MAX_PURCHASES_PER_UPGRADE}
            canAfford={game.points >= cost}
            onBuy={() => purchaseUpgrade(upgrade.id)}
          />
        )
      })}
    </div>
  )
}
