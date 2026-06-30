import { PointIcon } from './PointIcon'
import type { ShopItem } from '../types'

type ShopItemCardProps = {
  item: ShopItem
  canAfford: boolean
  owned: boolean
  quantity: number
  onBuy: () => void
}

export const ShopItemCard = ({
  item,
  canAfford,
  owned,
  quantity,
  onBuy,
}: ShopItemCardProps) => {
  const isConsumable = item.type === 'food' || item.type === 'toy' || item.type === 'care'
  const buttonLabel = owned && !isConsumable ? '已拥有' : isConsumable ? '买一个' : '去兑换'
  const detailLabel = isConsumable ? (quantity > 0 ? `背包 x${quantity}` : '') : owned ? '已拥有' : ''
  const detailPlaceholderLabel = isConsumable ? '背包 x0' : '已拥有'
  const typeLabelMap = {
    food: '食物',
    toy: '玩具',
    care: '用品',
    clothing: '衣服',
    background: '房间',
    effect: '特效',
  } as const

  return (
    <article className="shop-card">
      <div className="shop-card__top">
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
        <span className="chip chip--icon">
          <PointIcon size="sm" /> {item.price}
        </span>
        <span
          aria-hidden={!detailLabel}
          className={`chip chip--subtle ${detailLabel ? '' : 'shop-card__detail-chip--ghost'}`}
        >
          {detailLabel || detailPlaceholderLabel}
        </span>
      </div>

      <button
        className="primary-button shop-card__button"
        disabled={!canAfford || (owned && !isConsumable)}
        onClick={onBuy}
        type="button"
      >
        {buttonLabel}
      </button>
    </article>
  )
}
