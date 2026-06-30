import { PointIcon } from '../components/PointIcon'
import { InventoryItemCard } from '../components/InventoryItemCard'
import { usePetStore } from '../hooks/usePetStore'
import type { ItemType } from '../types'

const categoryOrder: ItemType[] = ['food', 'toy', 'care', 'clothing', 'background']

const categoryLabelMap = {
  food: '食物',
  toy: '玩具',
  care: '用品',
  clothing: '衣服',
  background: '房间',
  effect: '特效',
} as const

export const Inventory = () => {
  const { inventoryItems, inventory, pet, applyInventoryItem } = usePetStore()
  const getToyEnergyCost = (effect?: { energy?: number }) => Math.max(0, -(effect?.energy ?? 0))

  const groupedItems = categoryOrder.map((category) => ({
    category,
    label: categoryLabelMap[category],
    items: inventoryItems.filter((item) => item.type === category),
  }))

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">我的背包</p>
            <h2>现在拥有的食物、玩具、用品、衣服和房间都在这里</h2>
          </div>
          <span className="chip chip--icon">
            当前积分 <PointIcon size="sm" /> {pet.points}
          </span>
        </div>

        <div className="section-stack">
          {groupedItems.map((group) => (
            <section className="category-section" key={group.category}>
              <div className="category-section__header">
                <h3>{group.label}</h3>
                <span className="chip">{group.items.length} 件</span>
              </div>
              {group.items.length === 0 ? (
                <div className="empty-card empty-card--soft">
                  <strong>还没有{group.label}</strong>
                  <p>去商店逛逛，把喜欢的小礼物带回家吧。</p>
                </div>
              ) : (
                <div className="card-grid card-grid--quad">
                  {group.items.map((item) => {
                    const equipped =
                      pet.currentBackground === item.id ||
                      pet.currentHat === item.id ||
                      pet.currentScarf === item.id ||
                      pet.currentShoes === item.id

                    return (
                      <InventoryItemCard
                        disabled={
                          ((item.type === 'food' || item.type === 'toy' || item.type === 'care') &&
                            (inventory.consumables[item.id] ?? 0) <= 0) ||
                          (item.type === 'toy' && pet.energy < getToyEnergyCost(item.effect))
                        }
                        disabledLabel={
                          item.type === 'toy' &&
                          (inventory.consumables[item.id] ?? 0) > 0 &&
                          pet.energy < getToyEnergyCost(item.effect)
                            ? '先休息'
                            : '已用完'
                        }
                        equipped={equipped}
                        item={item}
                        key={item.id}
                        onUse={() => applyInventoryItem(item.id)}
                        quantity={inventory.consumables[item.id] ?? 0}
                      />
                    )
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
