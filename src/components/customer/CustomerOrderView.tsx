import React, { useState, useMemo } from 'react';
import { useBeverage } from '../../context/BeverageContext';
import { Product, Order } from '../../types';
import { BeverageCustomModal } from './BeverageCustomModal';
import { CartDrawer } from './CartDrawer';
import { CustomerCheckoutModal } from './CustomerCheckoutModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { OrderTrackerModal } from './OrderTrackerModal';
import {
  ShoppingBag,
  Sparkles,
  Clock,
  Tag,
  Search,
  CheckCircle,
  Share2,
  Info,
  Layers,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  Copy,
  QrCode,
  X,
  Smartphone,
  Check,
} from 'lucide-react';

export const CustomerOrderView: React.FC = () => {
  const {
    products,
    currentForm,
    forms,
    setActiveFormId,
    cartTotalCups,
    cartFinalTotal,
    openAdminWithTab,
    getShareableUrl,
    copyShareLink,
    showToast,
  } = useBeverage();

  // Search & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['全部', ...Array.from(set)];
  }, [products]);

  // Filter products based on currentForm allowedProductIds, selectedCategory, and searchQuery
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Form product restriction
      if (
        currentForm &&
        currentForm.allowedProductIds &&
        currentForm.allowedProductIds.length > 0
      ) {
        if (!currentForm.allowedProductIds.includes(p.id)) return false;
      }

      // Category filter
      if (selectedCategory !== '全部' && p.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        return matchName || matchDesc || matchCat;
      }

      return true;
    });
  }, [products, currentForm, selectedCategory, searchQuery]);

  const copyCurrentFormLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?formId=${currentForm?.id}`;
    navigator.clipboard.writeText(url);
    showToast('已複製前台訂購分享連結！');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      {/* Top Banner Notice from Form Config */}
      {currentForm && (
        <div className="bg-emerald-950 text-white border-b border-emerald-900">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-400 text-amber-950 rounded font-bold uppercase tracking-wider text-[10px]">
                活動表單
              </span>
              <span className="font-semibold text-emerald-100">{currentForm.title}</span>
              {currentForm.deadline && (
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-300">
                  <Clock className="w-3.5 h-3.5" />
                  截止: {currentForm.deadline.replace('T', ' ')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Form switcher for quick demo testing */}
              <div className="flex items-center gap-1 text-neutral-300">
                <span className="text-[11px] hidden sm:inline">表單:</span>
                <select
                  value={currentForm.id}
                  onChange={(e) => setActiveFormId(e.target.value)}
                  className="bg-emerald-900/90 text-white text-xs px-2 py-1 rounded-lg border border-emerald-700/60 focus:outline-none"
                >
                  {forms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-850 text-white rounded-lg transition-colors cursor-pointer"
                title="開啟分享與 QR Code 中心"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">分享表單</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTrackerOpen(true)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors cursor-pointer"
              >
                查詢訂單
              </button>

              {/* Direct Backend Entry for Store Owners/Staff */}
              <button
                type="button"
                onClick={() => openAdminWithTab('orders', currentForm.id)}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-amber-950 font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                title="進入門市管理後台 (查看訂單、修改庫存與表單)"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-950" />
                <span>切換至門市後台</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Brand Header */}
      <div className="bg-gradient-to-b from-white to-stone-100 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  茶韻手作 TEA MELODY
                </span>
                <span className="text-xs text-neutral-400">• 線上訂餐前台</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {currentForm?.title || '手作鮮萃茶飲 線上訂購'}
              </h1>
              <p className="text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                {currentForm?.description || '純粹好茶、在地牧場鮮乳與手煮配料，為您現場手搖每一杯好滋味。'}
              </p>
            </div>

            {/* Banner announcement promo box */}
            {currentForm?.bannerNotice && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 md:max-w-sm flex items-start gap-2.5 shadow-xs">
                <Tag className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 mb-0.5">本單專屬優惠與公告</h4>
                  <p className="text-xs text-emerald-800 leading-normal">
                    {currentForm.bannerNotice}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Search & Category Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  id={`cat-filter-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-xs font-bold'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋茶飲或品名..."
                className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 text-neutral-400">
            <Info className="w-10 h-10 mx-auto mb-2 opacity-40 text-neutral-400" />
            <p className="font-medium text-neutral-600">查無相符飲品</p>
            <p className="text-xs text-neutral-400 mt-1">請嘗試變更分類標籤或清除搜尋關鍵字</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col group ${
                  !product.inStock
                    ? 'border-neutral-200 opacity-60'
                    : 'border-neutral-200/90 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                {/* Product Image Thumbnail */}
                <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      product.inStock ? 'group-hover:scale-105' : 'grayscale'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-0.5 bg-black/60 text-white rounded-md font-medium backdrop-blur-xs">
                      {product.category}
                    </span>
                    {product.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-amber-500 text-white rounded-md font-medium shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Out of Stock Ribbon */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-full shadow-lg">
                        本日已售完
                      </span>
                    </div>
                  )}

                  {product.inStock && product.stockQty < 15 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-amber-600/90 text-white text-[10px] rounded-md font-bold">
                      庫存緊張 (剩 {product.stockQty} 杯)
                    </span>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 group-hover:text-emerald-900 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-neutral-400">大杯 / 中杯</div>
                      <div className="text-base font-extrabold text-neutral-900">
                        ${product.priceL}
                        <span className="text-xs font-normal text-neutral-500 ml-1">
                          (M ${product.priceM})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      id={`btn-customize-${product.id}`}
                      disabled={!product.inStock}
                      onClick={() => setCustomizingProduct(product)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        product.inStock
                          ? 'bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white shadow-xs'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      <span>選擇甜冰客製</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Store Management Bar for Staff & Managers */}
      <div className="max-w-6xl mx-auto px-4 mt-16 mb-8">
        <div className="bg-stone-900 rounded-2xl p-4 sm:p-5 text-stone-300 border border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>茶韻手作 • 門市人員管理專區</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">店員/店長</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                需要查看即時訂單處理、茶飲庫存控管、顧客 CRM 資料或建立新活動表單？
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-800 hover:bg-stone-700 active:bg-stone-850 text-stone-200 rounded-xl text-xs font-semibold border border-stone-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>取得分享 / 後台連結</span>
            </button>
            <button
              type="button"
              onClick={() => openAdminWithTab('orders', currentForm?.id)}
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>進入門市管理後台 →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartTotalCups > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-xl mx-auto animate-in slide-in-from-bottom duration-200">
          <div className="bg-emerald-950 text-white rounded-2xl p-3.5 shadow-2xl border border-emerald-800 flex items-center justify-between gap-3">
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => setIsCartOpen(true)}
            >
              <div className="relative p-2.5 bg-emerald-800 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-emerald-100" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-amber-950 rounded-full font-extrabold text-xs flex items-center justify-center">
                  {cartTotalCups}
                </span>
              </div>
              <div>
                <div className="text-xs text-emerald-300">已點 {cartTotalCups} 杯飲品</div>
                <div className="text-base font-extrabold text-white">
                  合計 ${cartFinalTotal}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-open-cart-floating"
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold rounded-xl transition-colors"
              >
                明細
              </button>
              <button
                type="button"
                id="btn-open-checkout-floating"
                onClick={() => setIsCheckoutOpen(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-amber-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
              >
                <span>立即結帳</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <BeverageCustomModal
        product={customizingProduct}
        onClose={() => setCustomizingProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CustomerCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setCompletedOrder(order)}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Front & Back Share Modal */}
      {isShareModalOpen && currentForm && (
        <CustomerShareModal
          form={currentForm}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};

interface CustomerShareModalProps {
  form: Order;
  onClose: () => void;
}

const CustomerShareModal: React.FC<{ form: any; onClose: () => void }> = ({ form, onClose }) => {
  const { getShareableUrl, copyShareLink, openAdminWithTab } = useBeverage();
  const [tab, setTab] = useState<'customer' | 'admin'>('customer');
  const [hasCopied, setHasCopied] = useState(false);

  const customerUrl = getShareableUrl('customer', form.id);
  const adminUrl = getShareableUrl('admin', form.id, 'orders');
  const currentUrl = tab === 'customer' ? customerUrl : adminUrl;

  const handleCopy = () => {
    copyShareLink(tab, form.id, 'orders');
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const isCustomer = tab === 'customer';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">分享與後台連結中心</h3>
              <p className="text-[11px] text-neutral-400 font-mono truncate max-w-[220px]">{form.title}</p>
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
            onClick={() => setTab('customer')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isCustomer
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>顧客訂購前台連結</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('admin')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isCustomer
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>門市管理後台連結</span>
          </button>
        </div>

        {/* Dynamic Explanation */}
        <div className="text-left px-1">
          {isCustomer ? (
            <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <span className="font-bold block text-emerald-950 mb-0.5">📱 傳給顧客/群組點餐：</span>
              顧客點開即可直接選茶飲下單，只包含點餐前台，不包含門市訂單與庫存設定權限。
            </div>
          ) : (
            <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950">
              <span className="font-bold block text-amber-900 mb-0.5">🏪 門市店長與店員管理：</span>
              開啟後將直接進入管理後台的「即時訂單管理」頁面，可進行接單、修改庫存與管理顧客！
            </div>
          )}
        </div>

        {/* URL Display */}
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
              <span>{hasCopied ? '已複製到剪貼簿！' : isCustomer ? '複製前台訂購連結' : '複製門市後台連結'}</span>
            </button>

            {!isCustomer && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAdminWithTab('orders', form.id);
                }}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>立即進入後台</span>
              </button>
            )}
          </div>

          <p className="text-[10px] text-neutral-400 text-center">
            💡 門市夥伴可直接收藏後台連結，或隨時點選畫面上方的「切換至門市後台」進入
          </p>
        </div>
      </div>
    </div>
  );
};
