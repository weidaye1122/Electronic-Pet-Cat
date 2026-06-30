import { useState } from 'react'
import { PointIcon } from '../components/PointIcon'
import { ShopItemCard } from '../components/ShopItemCard'
import { usePetStore } from '../hooks/usePetStore'
import type { ItemType } from '../types'

const filters: Array<{ label: string; value: ItemType }> = [
  { label: '食物', value: 'food' },
  { label: '玩具', value: 'toy' },
  { label: '用品', value: 'care' },
  { label: '衣服', value: 'clothing' },
  { label: '房间', value: 'background' },
]

export const Shop = () => {
  const [activeFilter, setActiveFilter] = useState<ItemType>('food')
  const { pet, shopItems, inventory, purchaseItem } = usePetStore()
  const visibleItems = shopItems.filter((item) => item.type === activeFilter)

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header">
          <div className="shop-panel__intro">
            <p className="eyebrow">礼物商店</p>
            <div className="shop-panel__title-row">
              <h2>用积分给小猫换点惊喜吧</h2>
              <div className="filter-row filter-row--shop">
                {filters.map((filter) => (
                  <button
                    className={`filter-chip ${activeFilter === filter.value ? 'filter-chip--active' : ''}`}
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    type="button"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <span className="chip chip--icon">
            当前积分 <PointIcon size="sm" /> {pet.points}
          </span>
        </div>

        <div className="card-grid card-grid--quad">
          {visibleItems.map((item) => (
            <ShopItemCard
              canAfford={pet.points >= item.price}
              item={item}
              key={item.id}
              onBuy={() => purchaseItem(item.id)}
              owned={inventory.ownedItemIds.includes(item.id)}
              quantity={inventory.consumables[item.id] ?? 0}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
