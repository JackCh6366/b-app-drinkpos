import React from 'react';
import { Order } from '../../types';
import { CheckCircle2, Copy, Clock, Phone, MapPin, Mail, ArrowRight, Printer, Sparkles } from 'lucide-react';
import { useBeverage } from '../../context/BeverageContext';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { setActiveView, setAdminTab, showToast } = useBeverage();

  if (!order) return null;

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    showToast(`已複製訂單編號：${order.orderNumber}`);
  };

  return (
    <div
      id="order-success-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="order-success-modal"
        className="relative flex flex-col w-full max-w-lg max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">訂單已成功送出！</h3>
          <p className="text-emerald-100 text-xs mt-1">
            店家已收到您的訂購內容，即將開始用心調製。
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-mono font-bold tracking-wider">
            <span>{order.orderNumber}</span>
            <button
              onClick={copyOrderNumber}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="複製編號"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-neutral-800 text-xs">
          {/* Status Progress */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-900 text-sm">即時訂單進度</span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-medium rounded-full text-[11px] animate-pulse">
                店家待確認
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] text-neutral-500 pt-1">
              <div className="p-1 rounded bg-emerald-700 text-white font-bold">1.已下單</div>
              <div className="p-1 rounded bg-neutral-200">2.製作中</div>
              <div className="p-1 rounded bg-neutral-200">3.待取/外送</div>
              <div className="p-1 rounded bg-neutral-200">4.完成</div>
            </div>
          </div>

          {/* Customer info snapshot */}
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 space-y-1.5">
            <h4 className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-1">
              訂購人資料明細
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">姓名:</span>
              <span className="font-semibold text-neutral-900">{order.customer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">電話:</span>
              <span className="font-semibold text-neutral-900">{order.customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">取餐模式:</span>
              <span className="font-medium text-emerald-800">
                {order.deliveryType === 'delivery' ? '店家專人外送' : '門市現場自取'}
              </span>
              <span className="text-neutral-400">({order.pickupTime})</span>
            </div>
            {order.customer.address ? (
              <div className="flex items-start gap-2">
                <span className="text-neutral-500 shrink-0">配送地址:</span>
                <span className="font-medium text-neutral-800">{order.customer.address}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neutral-400 italic">
                <span>配送地址:</span>
                <span>(自取免填地址)</span>
              </div>
            )}
            {order.customer.email && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">電子信箱:</span>
                <span className="text-neutral-800 font-mono">{order.customer.email}</span>
              </div>
            )}
            {order.notes && (
              <div className="flex items-start gap-2 pt-1 border-t border-neutral-200/60 mt-1">
                <span className="text-neutral-500 shrink-0">訂單備註:</span>
                <span className="text-neutral-700">{order.notes}</span>
              </div>
            )}
          </div>

          {/* Drink Cup Sticker Previews */}
          <div>
            <h4 className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
              <span>手搖杯標籤明細 (共 {order.totalCups} 杯)</span>
              <span className="text-neutral-400 font-normal">門市出單貼紙預覽</span>
            </h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-dashed border-neutral-300 bg-amber-50/30 flex items-center justify-between font-mono"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
                      <span>{item.name}</span>
                      <span className="text-emerald-700">[{item.size}杯]</span>
                      <span className="text-neutral-500 font-normal">x{item.quantity}</span>
                    </div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">
                      {item.sugar} / {item.ice}
                      {item.toppings.length > 0 && ` / 加:${item.toppings.map((t) => t.name).join('、')}`}
                    </div>
                    {item.notes && (
                      <div className="text-[10px] text-amber-700 italic">備註: {item.notes}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-neutral-800 text-xs">${item.totalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total snapshot */}
          <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
            <span className="text-neutral-600">應付總額 ({order.paymentMethod === 'linepay' ? 'LINE Pay' : order.paymentMethod === 'cash' ? '現金付款' : '銀行轉帳'})</span>
            <span className="text-lg font-bold text-emerald-900">${order.totalAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 font-medium text-neutral-700 hover:bg-neutral-100 transition-colors text-center"
          >
            繼續點購其他飲品
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              setActiveView('admin');
              setAdminTab('orders');
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>切換至POS後台接單</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
