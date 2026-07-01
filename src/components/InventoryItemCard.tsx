import type { ShopItem } from '../types'

type InventoryItemCardProps = {
  item: ShopItem
  quantity: number
  equipped: boolean
  disabled?: boolean
  disabledLabel?: string
  onUse: () => void
}

export const InventoryItemCard = ({
  item,
  quantity,
  equipped,
  disabled = false,
  disabledLabel = '已用完',
  onUse,
}: InventoryItemCardProps) => {
  const isConsumable = item.type === 'food' || item.type === 'toy' || item.type === 'care'
  const labelMap = {
    food: '喂给小猫',
    toy: '一起玩',
    care: '用一用',
    clothing: equipped ? '脱下来' : '穿上它',
    background: equipped ? '恢复默认' : '换房间',
    effect: '使用',
  } as const
  const typeLabelMap = {
    food: '食物',
    toy: '玩具',
    care: '用品',
    clothing: '衣服',
    background: '房间',
    effect: '特效',
  } as const
  const detailLabel = isConsumable ? `背包 x${quantity}` : equipped ? '正在使用' : ''
  const detailPlaceholderLabel = isConsumable ? '背包 x0' : '正在使用'

  return (
    <article className="inventory-card">
      <div className="inventory-card__top">
        <span className="shop-card__icon" aria-hidden="true">
          {item.icon}
        </span>
        <div>
          <strong>{item.name}</strong>
          <small>{item.description}</small>
        </div>
      </div>

      <div className="shop-card__meta shop-card__meta--inline">
        <span className="chip">{typeLabelMap[item.type]}</span>
        <span
          aria-hidden={!detailLabel}
          className={`chip chip--subtle ${detailLabel ? '' : 'shop-card__detail-chip--ghost'}`}
        >
          {detailLabel || detailPlaceholderLabel}
        </span>
      </div>

      <button
        className="secondary-button shop-card__button"
        data-feedback-kind="inventoryUse"
        disabled={disabled}
        onClick={onUse}
        type="button"
      >
        {disabled ? disabledLabel : labelMap[item.type]}
      </button>
    </article>
  )
}
