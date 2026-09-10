import React, { useState } from 'react';
import { useBeverage } from '../../context/BeverageContext';
import { DeliveryType, Order } from '../../types';
import { X, CheckCircle2, MapPin, Phone, User, Mail, Clock, CreditCard, AlertCircle } from 'lucide-react';

interface CustomerCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CustomerCheckoutModal: React.FC<CustomerCheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    currentForm,
    cart,
    cartTotalCups,
    cartSubtotal,
    cartDiscount,
    createOrder,
    showToast,
  } = useBeverage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(''); // 可填可不填
  const [email, setEmail] = useState('');     // email 欄位
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'linepay' | 'transfer'>('linepay');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; address?: string }>({});

  if (!isOpen) return null;

  // Calculate delivery fee
  const deliveryFee =
    deliveryType === 'delivery' &&
    currentForm &&
    cartSubtotal < currentForm.deliveryFeeThreshold
      ? 50
      : 0;

  const finalAmount = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string; email?: string; address?: string } = {};

    if (!name.trim()) {
      newErrors.name = '請填寫訂購人姓名';
    }

    if (!phone.trim()) {
      newErrors.phone = '請填寫聯絡手機電話';
    } else if (phone.trim().length < 8) {
      newErrors.phone = '請填寫正確有效的電話號碼';
    }

    if (email.trim() && !/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Email 格式不正確';
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      newErrors.address = '您選擇了「店家外送」，請填寫配送地址以利專人送達';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('請檢查並填寫完整訂購資料', 'warning');
      return;
    }

    setErrors({});

    const newOrder = createOrder({
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(), // 可填可不填
        email: email.trim(),     // email 欄位
      },
      deliveryType,
      pickupTime: pickupTime.trim() || (deliveryType === 'pickup' ? '儘速製作 (約15-20分鐘)' : '指定時段送達'),
      notes: notes.trim(),
      paymentMethod,
    });

    if (newOrder) {
      onClose();
      onOrderSuccess(newOrder);
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="checkout-modal"
        className="relative flex flex-col w-full max-w-xl max-h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span>填寫訂購人資料與結帳</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              來源表單：{currentForm?.title || '線上快速訂購'}
            </p>
          </div>
          <button
            type="button"
            id="btn-close-checkout-modal"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 取餐方式 */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
              取餐方式 (Delivery Option)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-delivery-pickup"
                onClick={() => {
                  setDeliveryType('pickup');
                  if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  deliveryType === 'pickup'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <span>門市自取 (免運費)</span>
              </button>

              <button
                type="button"
                id="btn-delivery-deliver"
                onClick={() => setDeliveryType('delivery')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  deliveryType === 'delivery'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <span>店家外送</span>
                {currentForm && currentForm.deliveryFeeThreshold > 0 && (
                  <span className="text-xs font-normal text-emerald-700">
                    (滿${currentForm.deliveryFeeThreshold}免運)
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 必填與選填欄位區域 */}
          <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200 space-y-4">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center justify-between">
              <span>訂購人聯絡資訊</span>
              <span className="text-[11px] font-normal text-neutral-500">* 為必填項目</span>
            </h4>

            {/* 1. 姓名 (必填) */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>訂購人姓名</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                id="input-customer-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="請輸入姓名 (例：王小明 / 林專案經理)"
                className={`w-full text-sm px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.name
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-neutral-200 focus:border-emerald-700 focus:ring-emerald-700'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* 2. 電話 (必填) */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>手機電話</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="tel"
                id="input-customer-phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="例：0912-345-678"
                className={`w-full text-sm px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.phone
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-neutral-200 focus:border-emerald-700 focus:ring-emerald-700'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* 3. 聯絡地址 (可填可不填) */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>聯絡地址</span>
                  <span className="text-xs text-neutral-400 font-normal">
                    {deliveryType === 'delivery' ? '(外送必填)' : '(可填可不填)'}
                  </span>
                </span>
                {deliveryType === 'pickup' && (
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    自取可免填
                  </span>
                )}
              </label>
              <input
                type="text"
                id="input-customer-address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                }}
                placeholder={
                  deliveryType === 'delivery'
                    ? '請輸入詳細外送地址 (含路名、樓層、辦公室室號)'
                    : '自取可留空，或輸入公司/部門方便備註'
                }
                className={`w-full text-sm px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.address
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-neutral-200 focus:border-emerald-700 focus:ring-emerald-700'
                }`}
              />
              {errors.address && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* 4. Email 欄位 */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>Email 電子信箱</span>
                <span className="text-xs text-neutral-400 font-normal">(接收電子訂單明細)</span>
              </label>
              <input
                type="email"
                id="input-customer-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="例：user@company.com (非必填，填寫可留存收據)"
                className={`w-full text-sm px-3.5 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.email
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-neutral-200 focus:border-emerald-700 focus:ring-emerald-700'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* 預計取餐/送達時間 & 備註 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>預計取餐 / 送達時間</span>
              </label>
              <input
                type="text"
                id="input-pickup-time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                placeholder="例：14:30、立即出餐"
                className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
                <span>付款方式</span>
              </label>
              <select
                id="select-payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-emerald-700"
              >
                <option value="linepay">LINE Pay 行動支付</option>
                <option value="cash">到店 / 外送現金付款</option>
                <option value="transfer">公司統一轉帳 / 統編匯款</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              整單特殊備註 (選填)
            </label>
            <input
              type="text"
              id="input-order-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例：需開立統編收據、抵達大樓請按門鈴、請附提袋..."
              className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-700"
            />
          </div>

          {/* 費用明細卡 */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-2 text-xs text-neutral-700">
            <div className="flex justify-between items-center text-neutral-600">
              <span>飲品杯數共計</span>
              <span className="font-semibold text-neutral-900">{cartTotalCups} 杯</span>
            </div>
            <div className="flex justify-between items-center">
              <span>商品小計</span>
              <span>${cartSubtotal}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-800 font-medium">
                <span>表單活動滿額折抵</span>
                <span>-${cartDiscount}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>外送運費</span>
              <span>{deliveryFee === 0 ? '免運 ($0)' : `$${deliveryFee}`}</span>
            </div>
            <div className="border-t border-emerald-200 pt-2 flex justify-between items-center text-sm font-bold text-neutral-900">
              <span>應付總額</span>
              <span className="text-xl text-emerald-800 font-extrabold">${finalAmount}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-submit-order"
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>確認資料並送出訂單 (${finalAmount})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
