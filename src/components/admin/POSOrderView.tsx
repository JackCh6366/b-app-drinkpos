import React, { useState, useMemo } from 'react';
import { useBeverage } from '../../context/BeverageContext';
import { Order, OrderStatus } from '../../types';
import {
  ClipboardList,
  Search,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Printer,
  Phone,
  MapPin,
  Mail,
  User,
  AlertCircle,
  DollarSign,
  Coffee,
  X,
  Send,
  Trash2,
} from 'lucide-react';

export const POSOrderView: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, showToast } = useBeverage();

  const [statusTab, setStatusTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('物料臨時售罄，已致電顧客說明');

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
  const deliveringOrders = orders.filter((o) => o.status === 'delivering_ready').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;

  const totalCupsSold = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalCups, 0);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusTab !== 'all' && o.status !== statusTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().replace(/[-\s]/g, '');
        const orderNo = o.orderNumber.toLowerCase().replace(/[-\s]/g, '');
        const phone = o.customer.phone.replace(/[-\s]/g, '').toLowerCase();
        const name = o.customer.name.toLowerCase();
        const email = (o.customer.email || '').toLowerCase();
        return orderNo.includes(q) || phone.includes(q) || name.includes(q) || email.includes(q);
      }
      return true;
    });
  }, [orders, statusTab, searchQuery]);

  const handleConfirmCancel = () => {
    if (cancelModalOrder) {
      updateOrderStatus(cancelModalOrder.id, 'cancelled', cancelReason);
      setCancelModalOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-800" />
            <span>POS 訂單管理後台</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            即時處理前台顧客由表單進來的訂單、推進製作進度、檢視顧客姓名/電話/地址/Email，並出單列印貼紙。
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-xs">
          <span className="text-xs font-medium text-neutral-500">今日營業總額</span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1">
            ${totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700">有效訂單累計</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800">新進待確認單</span>
            {pendingOrders > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">
            {pendingOrders} 筆
          </div>
          <span className="text-[11px] text-amber-700">請盡速確認接單</span>
        </div>

        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 shadow-xs">
          <span className="text-xs font-medium text-sky-800">製作與待取/外送</span>
          <div className="text-2xl font-extrabold text-sky-900 mt-1">
            {preparingOrders + deliveringOrders} 筆
          </div>
          <span className="text-[11px] text-sky-700">
            製作中: {preparingOrders} | 待取外送: {deliveringOrders}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-800">總出單杯數</span>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">
            {totalCupsSold} 杯
          </div>
          <span className="text-[11px] text-emerald-700">完成: {completedOrders} 筆</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setStatusTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              statusTab === 'all'
                ? 'bg-neutral-800 text-white font-bold'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            全部 ({totalOrders})
          </button>
          <button
            type="button"
            onClick={() => setStatusTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              statusTab === 'pending'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span>待確認</span>
            {pendingOrders > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full text-[10px] font-bold">
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setStatusTab('preparing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              statusTab === 'preparing'
                ? 'bg-sky-600 text-white font-bold'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            製作中 ({preparingOrders})
          </button>
          <button
            type="button"
            onClick={() => setStatusTab('delivering_ready')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              statusTab === 'delivering_ready'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            可取餐/外送 ({deliveringOrders})
          </button>
          <button
            type="button"
            onClick={() => setStatusTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              statusTab === 'completed'
                ? 'bg-emerald-700 text-white font-bold'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            已完成 ({completedOrders})
          </button>
          <button
            type="button"
            onClick={() => setStatusTab('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              statusTab === 'cancelled'
                ? 'bg-rose-700 text-white font-bold'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            已取消
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋單號、電話、姓名..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-35" />
            <p className="font-medium text-neutral-600">目前此分類尚無訂單</p>
            <p className="text-xs text-neutral-400 mt-1">可在前台下單測試，訂單將會即時同步至此處</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-4 ${
                  order.status === 'pending'
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : order.status === 'cancelled'
                    ? 'border-neutral-200 opacity-65'
                    : 'border-neutral-200'
                }`}
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-neutral-900">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        order.status === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : order.status === 'preparing'
                          ? 'bg-sky-100 text-sky-900'
                          : order.status === 'delivering_ready'
                          ? 'bg-purple-100 text-purple-900'
                          : order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {order.status === 'pending' && '待確認接單'}
                      {order.status === 'preparing' && '製作調配中'}
                      {order.status === 'delivering_ready' && '待取餐 / 外送中'}
                      {order.status === 'completed' && '已完成結單'}
                      {order.status === 'cancelled' && '已取消'}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      下單時間: {order.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                      來源: {order.formTitle || '一般線上點單'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForPrint(order)}
                      className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg flex items-center gap-1 font-medium transition-colors"
                      title="列印杯身貼紙與出單小票"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>列印杯貼小票</span>
                    </button>
                  </div>
                </div>

                {/* Customer Information (Name, Phone, Address, Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-neutral-50/70 p-3.5 rounded-xl text-xs">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-400 block text-[11px]">訂購人</span>
                      <span className="font-bold text-neutral-900">{order.customer.name}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-400 block text-[11px]">聯絡手機</span>
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="font-bold text-emerald-800 hover:underline"
                      >
                        {order.customer.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-400 block text-[11px]">
                        取餐方式 / 聯絡地址
                      </span>
                      <span className="font-semibold text-neutral-800">
                        {order.deliveryType === 'delivery' ? '【店家外送】' : '【門市自取】'}
                      </span>
                      <p className="text-neutral-600 break-words mt-0.5">
                        {order.customer.address ? order.customer.address : '(未填地址/自取)'}
                      </p>
                      <span className="text-neutral-400 text-[10px]">時段: {order.pickupTime}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Email 欄位</span>
                      <span className="text-neutral-700 font-mono break-all">
                        {order.customer.email ? order.customer.email : '(未填寫 Email)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-neutral-700 flex justify-between">
                    <span>訂購內容明細 (共 {order.totalCups} 杯)</span>
                    <span className="text-neutral-500 font-normal">
                      付款方式：{order.paymentMethod === 'linepay' ? 'LINE Pay' : order.paymentMethod === 'cash' ? '現金' : '轉帳'}
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-xl overflow-hidden bg-white">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 flex items-center justify-between text-xs hover:bg-neutral-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-100 font-medium">
                                {item.size}杯
                              </span>
                              <span className="text-neutral-500">x{item.quantity}</span>
                            </div>
                            <div className="text-neutral-500 text-[11px] mt-0.5">
                              <span>{item.sugar}</span> • <span>{item.ice}</span>
                              {item.toppings.length > 0 && (
                                <span className="text-amber-800 font-medium ml-1">
                                  [加:{item.toppings.map((t) => t.name).join('、')}]
                                </span>
                              )}
                              {item.notes && (
                                <span className="text-neutral-400 ml-1.5 italic">
                                  ({item.notes})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono font-bold text-neutral-800">
                          ${item.totalPrice}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="text-xs bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-lg text-amber-900 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">訂單備註：</span>
                        <span>{order.notes}</span>
                      </div>
                    </div>
                  )}

                  {order.cancelReason && order.status === 'cancelled' && (
                    <div className="text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-rose-800">
                      <span className="font-bold">取消原因：</span>
                      <span>{order.cancelReason}</span>
                    </div>
                  )}
                </div>

                {/* Amount Summary & Order Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-neutral-500">
                      小計: <strong className="text-neutral-800">${order.subtotal}</strong>
                    </span>
                    {order.discount > 0 && (
                      <span className="text-emerald-700">
                        折扣: <strong>-${order.discount}</strong>
                      </span>
                    )}
                    {order.deliveryFee > 0 && (
                      <span className="text-neutral-500">
                        運費: <strong>+${order.deliveryFee}</strong>
                      </span>
                    )}
                    <span className="text-sm font-extrabold text-emerald-950">
                      總金額: ${order.totalAmount}
                    </span>
                  </div>

                  {/* Status workflow triggers */}
                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>接單並開始製作</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelModalOrder(order)}
                          className="px-3 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium rounded-xl transition-colors"
                        >
                          拒單/取消
                        </button>
                      </>
                    )}

                    {order.status === 'preparing' && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'delivering_ready')}
                          className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>調製完畢 (通知取餐/外送)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelModalOrder(order)}
                          className="px-3 py-2 border border-neutral-200 text-neutral-500 hover:bg-neutral-100 text-xs rounded-xl"
                        >
                          取消
                        </button>
                      </>
                    )}

                    {order.status === 'delivering_ready' && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>確認送達 / 已完成結單</span>
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <span className="text-xs text-emerald-800 font-semibold px-2 py-1 bg-emerald-50 rounded-lg">
                        ✓ 本單已順利結單完成
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`確定要刪除訂單 ${order.orderNumber} 嗎？`)) {
                          deleteOrder(order.id);
                        }
                      }}
                      className="p-2 text-neutral-300 hover:text-rose-500 rounded-lg"
                      title="刪除紀錄"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Kitchen Ticket / Thermal Cup Stickers Print Modal */}
      {selectedOrderForPrint && (
        <KitchenPrintModal
          order={selectedOrderForPrint}
          onClose={() => setSelectedOrderForPrint(null)}
        />
      )}

      {/* Cancel Reason Modal */}
      {cancelModalOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setCancelModalOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-neutral-900 text-base">取消訂單確認</h3>
            <p className="text-xs text-neutral-500">
              訂單編號：{cancelModalOrder.orderNumber} (顧客：{cancelModalOrder.customer.name})
            </p>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                取消原因備註
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 border rounded-xl text-xs text-neutral-600 hover:bg-neutral-100"
              >
                返回
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
              >
                確認取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface KitchenPrintModalProps {
  order: Order;
  onClose: () => void;
}

const KitchenPrintModal: React.FC<KitchenPrintModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Flatten cups for sticker printing
  const individualCups: Array<{
    itemIndex: number;
    cupNumber: number;
    totalCups: number;
    name: string;
    size: string;
    sugar: string;
    ice: string;
    toppings: string[];
    notes: string;
    price: number;
  }> = [];

  let currentCupCount = 0;
  order.items.forEach((item, itemIdx) => {
    for (let q = 0; q < item.quantity; q++) {
      currentCupCount++;
      individualCups.push({
        itemIndex: itemIdx + 1,
        cupNumber: currentCupCount,
        totalCups: order.totalCups,
        name: item.name,
        size: item.size,
        sugar: item.sugar,
        ice: item.ice,
        toppings: item.toppings.map((t) => t.name),
        notes: item.notes,
        price: item.unitPrice + item.toppings.reduce((s, t) => s + t.price, 0),
      });
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div>
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
              <Printer className="w-5 h-5 text-emerald-800" />
              <span>手搖杯身貼標 & 廚房出單小票預覽</span>
            </h3>
            <p className="text-xs text-neutral-500">標準 50mm x 30mm 熱感應標籤貼紙格式</p>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-100 font-mono">
          {/* Thermal Cup Stickers Grid */}
          <div>
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
              杯身貼標 (共 {individualCups.length} 張標籤)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {individualCups.map((cup) => (
                <div
                  key={cup.cupNumber}
                  className="bg-white p-3.5 rounded-lg border-2 border-dashed border-neutral-300 shadow-xs flex flex-col justify-between text-xs text-neutral-900"
                >
                  <div className="flex justify-between items-baseline border-b border-neutral-200 pb-1.5 mb-1.5">
                    <span className="font-extrabold text-emerald-900">茶韻手作 TEA MELODY</span>
                    <span className="font-bold text-neutral-700">
                      杯號: {cup.cupNumber} / {cup.totalCups}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-extrabold flex justify-between">
                      <span>{cup.name}</span>
                      <span className="text-emerald-800">[{cup.size}杯]</span>
                    </div>
                    <div className="text-xs font-bold text-neutral-800">
                      {cup.sugar} • {cup.ice}
                    </div>
                    {cup.toppings.length > 0 && (
                      <div className="text-[11px] text-amber-800 font-semibold">
                        +加料: {cup.toppings.join('、')}
                      </div>
                    )}
                    {cup.notes && (
                      <div className="text-[10px] text-rose-700 italic">備註: {cup.notes}</div>
                    )}
                  </div>

                  <div className="mt-3 pt-1.5 border-t border-dashed border-neutral-200 text-[10px] text-neutral-500 flex justify-between items-center">
                    <span>單號: {order.orderNumber}</span>
                    <span>{order.customer.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-neutral-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-xl text-xs text-neutral-600 hover:bg-neutral-100"
          >
            關閉
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>列印出單標籤</span>
          </button>
        </div>
      </div>
    </div>
  );
};
