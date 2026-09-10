import React, { useState } from 'react';
import { useBeverage } from '../../context/BeverageContext';
import { Order, OrderStatus } from '../../types';
import { X, Search, Clock, CheckCircle, Package, Truck, AlertCircle } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const { orders } = useBeverage();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase().replace(/[-\s]/g, '');

  const filteredOrders = orders.filter((o) => {
    if (!normalizedQuery) return false;
    const phone = o.customer.phone.replace(/[-\s]/g, '').toLowerCase();
    const orderNo = o.orderNumber.replace(/[-\s]/g, '').toLowerCase();
    const name = o.customer.name.toLowerCase();
    return phone.includes(normalizedQuery) || orderNo.includes(normalizedQuery) || name.includes(normalizedQuery);
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            店家待確認
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full font-bold text-xs flex items-center gap-1">
            <Package className="w-3.5 h-3.5" />
            用心調製中
          </span>
        );
      case 'delivering_ready':
        return (
          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-xs flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            可取餐 / 外送中
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            已完成訂單
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-xs flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            已取消
          </span>
        );
    }
  };

  return (
    <div
      id="order-tracker-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="order-tracker-modal"
        className="relative flex flex-col w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-50">
          <div>
            <h3 className="font-bold text-neutral-900 text-base">查詢訂單進度</h3>
            <p className="text-xs text-neutral-500">輸入訂購手機電話或訂單編號查詢</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-neutral-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              id="input-tracker-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHasSearched(true);
              }}
              placeholder="例：0912-345-678 或 #TM-..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-700"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <span className="text-[11px] text-neutral-400">快速試查:</span>
            <button
              onClick={() => {
                setQuery('0912-345-678');
                setHasSearched(true);
              }}
              className="text-[11px] text-emerald-800 hover:underline"
            >
              0912-345-678
            </button>
            <button
              onClick={() => {
                setQuery('0933-888-999');
                setHasSearched(true);
              }}
              className="text-[11px] text-emerald-800 hover:underline"
            >
              0933-888-999
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!hasSearched && query === '' ? (
            <div className="text-center py-10 text-neutral-400 text-xs">
              請在上方輸入您訂購時填寫的手機電話或訂單編號
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 text-xs">
              查無相符訂單記錄，請確認輸入資訊是否正確
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-neutral-900 text-sm">
                      {ord.orderNumber}
                    </span>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{ord.createdAt}</p>
                  </div>
                  {getStatusBadge(ord.status)}
                </div>

                <div className="pt-2 border-t border-neutral-200/70 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">訂購人:</span>
                    <span className="font-medium text-neutral-800">{ord.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">取餐模式:</span>
                    <span className="text-neutral-800">
                      {ord.deliveryType === 'pickup' ? '門市自取' : '外送'} ({ord.pickupTime})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">品項總計:</span>
                    <span className="font-medium text-neutral-800">{ord.totalCups} 杯 (${ord.totalAmount})</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200/50 space-y-1">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-neutral-600">
                      <span>
                        {item.name} ({item.size}杯) x{item.quantity} - {item.sugar}/{item.ice}
                      </span>
                      <span>${item.totalPrice}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
