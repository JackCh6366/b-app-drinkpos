import React, { useState } from 'react';
import { useBeverage } from '../../context/BeverageContext';
import { OrderFormConfig, Product } from '../../types';
import {
  FileCode2,
  Plus,
  Share2,
  Copy,
  ExternalLink,
  QrCode,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  ShoppingBag,
  X,
  Sparkles,
  LayoutDashboard,
  Smartphone,
  Check,
} from 'lucide-react';

export const FormManagerView: React.FC = () => {
  const {
    forms,
    products,
    createForm,
    updateForm,
    toggleFormStatus,
    deleteForm,
    openCustomerWithForm,
    openAdminWithTab,
    getShareableUrl,
    copyShareLink,
    showToast,
  } = useBeverage();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<OrderFormConfig | null>(null);
  const [qrCodeModalForm, setQrCodeModalForm] = useState<OrderFormConfig | null>(null);

  const handleOpenCreate = () => {
    setEditingForm(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (form: OrderFormConfig) => {
    setEditingForm(form);
    setIsFormModalOpen(true);
  };

  const copyCustomerLink = (form: OrderFormConfig) => {
    copyShareLink('customer', form.id);
  };

  const copyAdminLink = (form: OrderFormConfig) => {
    copyShareLink('admin', form.id, 'orders');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-emerald-800" />
            <span>表單生成管理後台</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            建立各檔期團購、企業下午茶、快閃限定等客製化訂購表單，自動生成專屬連結與 QR Code 供顧客前台點餐。
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>生成新訂購表單連結</span>
        </button>
      </div>

      {/* Forms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {forms.map((form) => {
          const formUrl = `${window.location.origin}${window.location.pathname}?formId=${form.id}`;
          const isAllProducts = !form.allowedProductIds || form.allowedProductIds.length === 0;

          return (
            <div
              key={form.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                form.isActive ? 'border-neutral-200 hover:border-emerald-300' : 'border-neutral-200 opacity-70 bg-neutral-50/50'
              }`}
            >
              {/* Card Top */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-neutral-900 leading-snug">
                        {form.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 mt-0.5 block">
                      slug: {form.slug}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFormStatus(form.id)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      form.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        form.isActive ? 'bg-emerald-600' : 'bg-neutral-400'
                      }`}
                    />
                    <span>{form.isActive ? '開放中' : '已暫停'}</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                  {form.description}
                </p>

                {/* Banner & Promos */}
                {form.bannerNotice && (
                  <div className="p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{form.bannerNotice}</span>
                  </div>
                )}

                {/* Rules snapshot */}
                <div className="space-y-1 text-xs text-neutral-500 pt-1">
                  {form.deadline && (
                    <div className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>截止時間：{form.deadline.replace('T', ' ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-[11px]">
                    <ShoppingBag className="w-3 h-3 text-neutral-400" />
                    <span>
                      上架商品：
                      {isAllProducts ? '全品項飲品' : `限定 ${form.allowedProductIds.length} 款特定飲品`}
                    </span>
                  </div>
                  {form.deliveryFeeThreshold > 0 && (
                    <div className="text-[11px] text-emerald-700">
                      • 滿 ${form.deliveryFeeThreshold} 免收外送費
                    </div>
                  )}
                  {form.discountThreshold && form.discountRate && (
                    <div className="text-[11px] text-amber-700">
                      • 滿 ${form.discountThreshold} 享 {form.discountRate * 10} 折優惠
                    </div>
                  )}
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-center">
                  <div className="p-2 bg-neutral-50 rounded-lg">
                    <span className="text-[10px] text-neutral-400">表單累計訂單</span>
                    <div className="font-extrabold text-neutral-900 text-sm">
                      {form.totalOrdersCount} 筆
                    </div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-lg">
                    <span className="text-[10px] text-neutral-400">表單累計營收</span>
                    <div className="font-extrabold text-emerald-900 text-sm">
                      ${form.totalSalesAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3.5 bg-neutral-50 border-t border-neutral-100 flex flex-col gap-2.5">
                {/* Section 1: Customer Front Link */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openCustomerWithForm(form.id)}
                    className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="以顧客視角開啟前台點餐頁面"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>開啟顧客前台</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyCustomerLink(form)}
                    className="py-2 px-2.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 rounded-xl transition-colors text-xs flex items-center gap-1"
                    title="複製顧客訂購前台專屬連結"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-800" />
                    <span className="text-[11px] font-medium">複製前台</span>
                  </button>
                </div>

                {/* Section 2: Store Admin Link */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openAdminWithTab('orders', form.id)}
                    className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl border border-stone-300/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="切換至POS後台查看此表單訂單"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-stone-700" />
                    <span>查看後台訂單</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyAdminLink(form)}
                    className="py-2 px-2.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 rounded-xl transition-colors text-xs flex items-center gap-1"
                    title="複製門市管理後台專屬連結"
                  >
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span className="text-[11px] font-medium">複製後台</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrCodeModalForm(form)}
                    className="py-2 px-2.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-colors text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                    title="開啟前台與後台 QR Code 分享中心"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-800" />
                    <span className="text-[11px] font-bold">QR 分享</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-200/60 text-neutral-400">
                  <span className="font-mono text-[10px]">建立日: {form.createdDate}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(form)}
                      className="text-neutral-500 hover:text-emerald-800 font-medium"
                    >
                      編輯
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`確定要刪除表單「${form.title}」嗎？`)) {
                          deleteForm(form.id);
                        }
                      }}
                      className="text-neutral-400 hover:text-rose-600 font-medium"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Edit / Create Modal */}
      {isFormModalOpen && (
        <FormConfigModal
          form={editingForm}
          products={products}
          onClose={() => setIsFormModalOpen(false)}
          onSave={(data) => {
            if (editingForm) {
              updateForm(editingForm.id, data);
            } else {
              createForm(data as any);
            }
            setIsFormModalOpen(false);
          }}
        />
      )}

      {/* Share & QR Code Modal */}
      {qrCodeModalForm && (
        <ShareAndQRCodeModal
          form={qrCodeModalForm}
          onClose={() => setQrCodeModalForm(null)}
        />
      )}
    </div>
  );
};

interface FormConfigModalProps {
  form: OrderFormConfig | null;
  products: Product[];
  onClose: () => void;
  onSave: (data: Partial<OrderFormConfig>) => void;
}

const FormConfigModal: React.FC<FormConfigModalProps> = ({
  form,
  products,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(form?.title || '');
  const [slug, setSlug] = useState(form?.slug || `order-${Date.now().toString(36)}`);
  const [description, setDescription] = useState(form?.description || '');
  const [bannerNotice, setBannerNotice] = useState(form?.bannerNotice || '');
  const [deadline, setDeadline] = useState(form?.deadline || '');
  const [deliveryFeeThreshold, setDeliveryFeeThreshold] = useState<number>(
    form?.deliveryFeeThreshold ?? 300
  );
  const [discountThreshold, setDiscountThreshold] = useState<number>(
    form?.discountThreshold ?? 500
  );
  const [discountRate, setDiscountRate] = useState<number>(form?.discountRate ?? 0.9);
  const [allowedProductIds, setAllowedProductIds] = useState<string[]>(
    form?.allowedProductIds || []
  );
  const [isActive, setIsActive] = useState<boolean>(form?.isActive ?? true);

  const toggleAllowedProduct = (prodId: string) => {
    if (allowedProductIds.includes(prodId)) {
      setAllowedProductIds(allowedProductIds.filter((id) => id !== prodId));
    } else {
      setAllowedProductIds([...allowedProductIds, prodId]);
    }
  };

  const handleSelectAllProducts = () => {
    setAllowedProductIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      bannerNotice: bannerNotice.trim(),
      deadline: deadline ? deadline : undefined,
      deliveryFeeThreshold: Number(deliveryFeeThreshold),
      discountThreshold: Number(discountThreshold),
      discountRate: Number(discountRate),
      allowedProductIds,
      isActive,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h3 className="font-bold text-neutral-900 text-base">
            {form ? `編輯表單設定：${form.title}` : '生成新訂購表單連結'}
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              表單名稱 / 活動標題 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：信義科技商辦週五下午茶、夏日鮮果限定"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">網址 Slug 代碼</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="xinyi-tea-party"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                截止截單時間 (選填)
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">表單簡介說明</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="說明本次團購對象、配送方式或備註事項..."
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              頂部優惠公告標語 (Banner)
            </label>
            <input
              type="text"
              value={bannerNotice}
              onChange={(e) => setBannerNotice(e.target.value)}
              placeholder="例：🎉 本單滿 $500 即享 9 折優惠，滿 $300 免外送費！"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>

          {/* Discounts Configuration */}
          <div className="grid grid-cols-3 gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <div>
              <label className="block font-medium text-neutral-600 mb-1">滿額免運門檻</label>
              <div className="flex items-center">
                <span className="text-neutral-400 mr-1">$</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={deliveryFeeThreshold}
                  onChange={(e) => setDeliveryFeeThreshold(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-600 mb-1">滿額折扣門檻</label>
              <div className="flex items-center">
                <span className="text-neutral-400 mr-1">$</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={discountThreshold}
                  onChange={(e) => setDiscountThreshold(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-600 mb-1">折扣折數</label>
              <select
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded text-xs"
              >
                <option value={1}>無折扣 (原價)</option>
                <option value={0.95}>95 折</option>
                <option value={0.9}>9 折</option>
                <option value={0.88}>88 折</option>
                <option value={0.85}>85 折</option>
                <option value={0.8}>8 折</option>
              </select>
            </div>
          </div>

          {/* Product Whitelist */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-neutral-700">
                限定販售飲品商品 ({allowedProductIds.length === 0 ? '全品項開放' : `限定 ${allowedProductIds.length} 款`})
              </label>
              <button
                type="button"
                onClick={handleSelectAllProducts}
                className="text-emerald-800 hover:underline font-medium"
              >
                全部開放
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto border border-neutral-200 rounded-lg p-2.5 grid grid-cols-2 gap-1.5 bg-white">
              {products.map((p) => {
                const isChecked =
                  allowedProductIds.length === 0 || allowedProductIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 p-1 rounded hover:bg-neutral-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={allowedProductIds.includes(p.id)}
                      onChange={() => toggleAllowedProduct(p.id)}
                      className="rounded text-emerald-800 focus:ring-emerald-700"
                    />
                    <span className="truncate">{p.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="check-form-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-700"
            />
            <label htmlFor="check-form-active" className="text-neutral-700 cursor-pointer">
              立即開放此表單接受點餐
            </label>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-neutral-600 hover:bg-neutral-100"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs"
            >
              確認儲存表單
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ShareAndQRCodeModalProps {
  form: OrderFormConfig;
  onClose: () => void;
}

const ShareAndQRCodeModal: React.FC<ShareAndQRCodeModalProps> = ({ form, onClose }) => {
  const { getShareableUrl, copyShareLink, openCustomerWithForm, openAdminWithTab } = useBeverage();
  const [modalTab, setModalTab] = useState<'customer' | 'admin'>('customer');
  const [hasCopied, setHasCopied] = useState(false);

  const customerUrl = getShareableUrl('customer', form.id);
  const adminUrl = getShareableUrl('admin', form.id, 'orders');
  const currentUrl = modalTab === 'customer' ? customerUrl : adminUrl;

  const handleCopy = () => {
    copyShareLink(modalTab, form.id, 'orders');
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const isCustomer = modalTab === 'customer';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">表單專屬連結與 QR Code</h3>
              <p className="text-[11px] text-neutral-400 font-mono truncate max-w-[240px]">{form.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="p-1 bg-neutral-100 rounded-xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => setModalTab('customer')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isCustomer
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>顧客訂購前台</span>
          </button>
          <button
            type="button"
            onClick={() => setModalTab('admin')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isCustomer
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>門市管理後台</span>
          </button>
        </div>

        {/* Dynamic description of the current view */}
        <div className="text-left px-1">
          {isCustomer ? (
            <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <span className="font-bold block text-emerald-950 mb-0.5">📱 給顧客點餐使用：</span>
              顧客手機掃描或點擊後，可直接瀏覽此表單飲品並送出訂購單，完全不需門市管理權限。
            </div>
          ) : (
            <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950">
              <span className="font-bold block text-amber-900 mb-0.5">🏪 給店長與夥伴後台管理使用：</span>
              此連結將直接載入門市 POS 後台並篩選此表單訂單，可即時接單、修改飲品庫存與 CRM 客戶資料！
            </div>
          )}
        </div>

        {/* Clean SVG QR Code Representation */}
        <div className="p-4 bg-stone-50 border border-neutral-200 rounded-2xl inline-block shadow-inner">
          <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
            {/* Background */}
            <rect width="100" height="100" fill="#ffffff" rx="4" />
            {/* Color based on role */}
            {(() => {
              const primary = isCustomer ? '#064e3b' : '#1c1917';
              return (
                <>
                  {/* Positioning square Top-Left */}
                  <rect x="10" y="10" width="22" height="22" fill={primary} rx="3" />
                  <rect x="14" y="14" width="14" height="14" fill="#ffffff" rx="2" />
                  <rect x="17" y="17" width="8" height="8" fill={primary} rx="1" />

                  {/* Positioning square Top-Right */}
                  <rect x="68" y="10" width="22" height="22" fill={primary} rx="3" />
                  <rect x="72" y="14" width="14" height="14" fill="#ffffff" rx="2" />
                  <rect x="75" y="17" width="8" height="8" fill={primary} rx="1" />

                  {/* Positioning square Bottom-Left */}
                  <rect x="10" y="68" width="22" height="22" fill={primary} rx="3" />
                  <rect x="14" y="72" width="14" height="14" fill="#ffffff" rx="2" />
                  <rect x="17" y="75" width="8" height="8" fill={primary} rx="1" />

                  {/* Simulated Data Matrix Dots */}
                  <rect x="36" y="12" width="6" height="6" fill={primary} />
                  <rect x="46" y="12" width="6" height="6" fill={primary} />
                  <rect x="56" y="12" width="6" height="6" fill={primary} />
                  <rect x="36" y="22" width="6" height="6" fill={primary} />
                  <rect x="46" y="26" width="6" height="6" fill={primary} />
                  <rect x="56" y="22" width="6" height="6" fill={primary} />
                  <rect x="12" y="36" width="6" height="6" fill={primary} />
                  <rect x="22" y="42" width="6" height="6" fill={primary} />
                  <rect x="36" y="36" width="6" height="6" fill={primary} />
                  <rect x="44" y="44" width="12" height="12" fill={primary} rx="2" />
                  <rect x="62" y="36" width="6" height="6" fill={primary} />
                  <rect x="72" y="42" width="6" height="6" fill={primary} />
                  <rect x="82" y="36" width="6" height="6" fill={primary} />
                  <rect x="36" y="60" width="6" height="6" fill={primary} />
                  <rect x="46" y="66" width="6" height="6" fill={primary} />
                  <rect x="56" y="60" width="6" height="6" fill={primary} />
                  <rect x="36" y="76" width="6" height="6" fill={primary} />
                  <rect x="46" y="82" width="6" height="6" fill={primary} />
                  <rect x="68" y="72" width="6" height="6" fill={primary} />
                  <rect x="78" y="76" width="12" height="6" fill={primary} />
                  <rect x="68" y="84" width="12" height="6" fill={primary} />
                </>
              );
            })()}
          </svg>
        </div>

        {/* URL Box */}
        <div className="text-[11px] font-mono text-neutral-600 bg-neutral-100 p-2.5 rounded-xl break-all text-left border border-neutral-200/80">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
            {isCustomer ? '顧客端網址 (預設點餐)' : '管理端網址 (POS後台)'}
          </span>
          {currentUrl}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                hasCopied
                  ? 'bg-emerald-700'
                  : isCustomer
                  ? 'bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950'
                  : 'bg-stone-800 hover:bg-stone-900 active:bg-stone-950'
              }`}
            >
              {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{hasCopied ? '已複製到剪貼簿！' : isCustomer ? '複製顧客訂購連結' : '複製門市後台連結'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (isCustomer) {
                  openCustomerWithForm(form.id);
                } else {
                  openAdminWithTab('orders', form.id);
                }
              }}
              className="px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 flex items-center gap-1 cursor-pointer"
              title={isCustomer ? '直接前往顧客前台' : '直接前往門市後台'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>直接開啟</span>
            </button>
          </div>

          <p className="text-[10px] text-neutral-400 text-center">
            💡 進入任何前台頁面後，亦可點擊頂端選單或底部的「切換至門市後台」隨時查看
          </p>
        </div>
      </div>
    </div>
  );
};
