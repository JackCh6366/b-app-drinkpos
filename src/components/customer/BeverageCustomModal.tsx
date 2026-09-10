import React, { useState } from 'react';
import { Product, CupSize, SugarLevel, IceLevel, ToppingOption, CartItem } from '../../types';
import { useBeverage } from '../../context/BeverageContext';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';

interface BeverageCustomModalProps {
  product: Product | null;
  onClose: () => void;
}

const SUGAR_OPTIONS: SugarLevel[] = [
  '全糖 (100%)',
  '少糖 (70%)',
  '半糖 (50%)',
  '微糖 (30%)',
  '一分糖 (10%)',
  '無糖 (0%)',
];

const ICE_OPTIONS: IceLevel[] = [
  '正常冰',
  '少冰',
  '微冰',
  '去冰',
  '完全去冰',
  '常溫',
  '溫熱',
];

export const BeverageCustomModal: React.FC<BeverageCustomModalProps> = ({
  product,
  onClose,
}) => {
  const { toppings, addToCart } = useBeverage();

  if (!product) return null;

  const [size, setSize] = useState<CupSize>('L');
  const [sugar, setSugar] = useState<SugarLevel>(product.defaultSugar || '微糖 (30%)');
  const [ice, setIce] = useState<IceLevel>(product.defaultIce || '微冰');
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  const basePrice = size === 'M' ? product.priceM : product.priceL;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = basePrice;
  const totalItemPrice = (unitPrice + toppingsPrice) * quantity;

  const toggleTopping = (topping: ToppingOption) => {
    if (!topping.inStock) return;
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleConfirmAddToCart = () => {
    const item: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      size,
      unitPrice,
      sugar,
      ice,
      toppings: selectedToppings,
      notes: notes.trim(),
      quantity,
      totalPrice: totalItemPrice,
    };
    addToCart(item);
    onClose();
  };

  return (
    <div
      id="custom-beverage-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="custom-beverage-modal"
        className="relative flex flex-col w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-40 w-full overflow-hidden bg-emerald-900 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            id="btn-close-custom-modal"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-emerald-600 rounded-full font-medium">
                {product.category}
              </span>
              {product.tags?.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 bg-amber-500 rounded-full font-medium">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-bold mt-1 text-white tracking-tight">{product.name}</h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-neutral-800">
          {product.description && (
            <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200/80">
              {product.description}
            </p>
          )}

          {/* 1. 容量尺寸 (Cup Size) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              選擇容量 (Size)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-select-size-m"
                onClick={() => setSize('M')}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  size === 'M'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                }`}
              >
                <span>中杯 (M - 500ml)</span>
                <span className="font-semibold">${product.priceM}</span>
              </button>
              <button
                type="button"
                id="btn-select-size-l"
                onClick={() => setSize('L')}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  size === 'L'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                }`}
              >
                <span>大杯 (L - 700ml)</span>
                <span className="font-semibold">${product.priceL}</span>
              </button>
            </div>
          </div>

          {/* 2. 甜度 (Sugar Level) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                甜度 (Sugar)
              </label>
              <span className="text-xs text-emerald-800 font-semibold">{sugar}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SUGAR_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  id={`btn-sugar-${s}`}
                  onClick={() => setSugar(s)}
                  className={`py-2 px-2 text-xs rounded-lg border transition-all text-center ${
                    sugar === s
                      ? 'border-emerald-700 bg-emerald-700 text-white font-medium shadow-xs'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 3. 冰量 (Ice Level) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                溫度 / 冰量 (Ice Level)
              </label>
              <span className="text-xs text-emerald-800 font-semibold">{ice}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ICE_OPTIONS.filter((i) => {
                if (i === '溫熱' && product.allowedHot === false) return false;
                return true;
              }).map((i) => (
                <button
                  key={i}
                  type="button"
                  id={`btn-ice-${i}`}
                  onClick={() => setIce(i)}
                  className={`py-2 px-2 text-xs rounded-lg border transition-all text-center ${
                    ice === i
                      ? 'border-emerald-700 bg-emerald-700 text-white font-medium shadow-xs'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* 4. 加料配料 (Toppings) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                加料配料 (加選)
              </label>
              <span className="text-xs text-neutral-500">可複選</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {toppings.map((t) => {
                const isSelected = selectedToppings.some((item) => item.id === t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    id={`btn-topping-${t.id}`}
                    disabled={!t.inStock}
                    onClick={() => toggleTopping(t)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                      !t.inStock
                        ? 'opacity-45 bg-neutral-100 border-neutral-200 cursor-not-allowed text-neutral-400'
                        : isSelected
                        ? 'border-emerald-700 bg-emerald-50/80 text-emerald-900 font-medium'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <div
                        className={`w-4 h-4 rounded-sm flex items-center justify-center border text-[10px] ${
                          isSelected
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{t.name}</span>
                    </div>
                    <span className="text-neutral-500 shrink-0">
                      {t.inStock ? `+$${t.price}` : '已售完'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 客製備註 (Notes) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              飲品特殊需求 / 備註
            </label>
            <input
              type="text"
              id="input-item-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例：料分開裝、少波霸多茶凍..."
              className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-4">
          <div className="flex items-center border border-neutral-300 rounded-xl bg-white p-1">
            <button
              type="button"
              id="btn-decrease-qty"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1.5 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-neutral-800">
              {quantity}
            </span>
            <button
              type="button"
              id="btn-increase-qty"
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 text-neutral-600 hover:text-neutral-900"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            id="btn-add-to-cart-submit"
            onClick={handleConfirmAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>加入購物車</span>
            <span>•</span>
            <span>${totalItemPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
