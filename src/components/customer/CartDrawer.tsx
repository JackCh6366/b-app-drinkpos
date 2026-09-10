import React from 'react';
import { useBeverage } from '../../context/BeverageContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    currentForm,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartTotalCups,
    cartSubtotal,
    cartDiscount,
    cartFinalTotal,
  } = useBeverage();

  if (!isOpen) return null;

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        id="cart-drawer"
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">購物清單</h3>
              <p className="text-xs text-neutral-500">共 {cartTotalCups} 杯飲品</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                type="button"
                id="btn-clear-cart"
                onClick={clearCart}
                className="text-xs text-neutral-400 hover:text-rose-600 px-2 py-1 rounded transition-colors"
              >
                清空
              </button>
            )}
            <button
              type="button"
              id="btn-close-cart-drawer"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-neutral-400">
              <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-2 opacity-40" />
              <p className="text-sm font-medium text-neutral-500">購物車還是空的喔</p>
              <p className="text-xs text-neutral-400 mt-1">選杯好茶加入清單吧！</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3.5 rounded-xl border border-neutral-200/90 bg-white hover:border-emerald-200 transition-all shadow-xs flex flex-col gap-2"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-neutral-900">
                        {item.name}
                      </span>
                      <span className="text-xs px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-medium">
                        {item.size}杯
                      </span>
                    </div>
                    {/* Customizations tags */}
                    <div className="text-xs text-neutral-500 mt-1 flex flex-wrap gap-1">
                      <span className="bg-neutral-100 px-1.5 py-0.5 rounded">{item.sugar}</span>
                      <span className="bg-neutral-100 px-1.5 py-0.5 rounded">{item.ice}</span>
                      {item.toppings.map((t) => (
                        <span
                          key={t.id}
                          className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[11px]"
                        >
                          +{t.name} (${t.price})
                        </span>
                      ))}
                    </div>
                    {item.notes && (
                      <p className="text-xs text-neutral-500 italic mt-1 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                        備註: {item.notes}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-neutral-300 hover:text-rose-500 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Price & Quantity Stepper */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-2 mt-1">
                  <span className="text-sm font-bold text-neutral-900">
                    ${item.totalPrice}
                  </span>
                  <div className="flex items-center border border-neutral-200 rounded-lg p-0.5 bg-neutral-50">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateCartItem(item.cartItemId, { quantity: item.quantity - 1 })
                          : removeFromCart(item.cartItemId)
                      }
                      className="p-1 text-neutral-500 hover:text-neutral-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-neutral-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartItem(item.cartItemId, { quantity: item.quantity + 1 })
                      }
                      className="p-1 text-neutral-500 hover:text-neutral-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>小計 ({cartTotalCups} 杯)</span>
                <span>${cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>滿額活動折扣</span>
                  <span>-${cartDiscount}</span>
                </div>
              )}
              {currentForm && currentForm.deliveryFeeThreshold > 0 && (
                <div className="text-[11px] text-emerald-700">
                  {cartSubtotal >= currentForm.deliveryFeeThreshold
                    ? '✨ 已符合店家外送免運資格！'
                    : `再滿 $${currentForm.deliveryFeeThreshold - cartSubtotal} 即可享外送免運`}
                </div>
              )}
              <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-bold text-neutral-900">
                <span>合計金額</span>
                <span className="text-lg text-emerald-800 font-extrabold">
                  ${cartFinalTotal}
                </span>
              </div>
            </div>

            <button
              type="button"
              id="btn-proceed-to-checkout"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>填寫訂購人資訊結帳</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
