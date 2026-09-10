import React from 'react';
import { useBeverage } from '../context/BeverageContext';
import {
  Coffee,
  Smartphone,
  LayoutDashboard,
  RefreshCw,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Share2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    orders,
    cartTotalCups,
    resetAllData,
    toasts,
    dismissToast,
    copyShareLink,
  } = useBeverage();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0"
            onClick={() => setActiveView('customer')}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm text-neutral-900 tracking-tight">
                  茶韻手作
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded hidden sm:inline">
                  Tea Melody
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 block -mt-0.5 hidden sm:block">
                手搖茶飲線上訂購 & POS CRM 系統
              </span>
            </div>
          </div>

          {/* Center Mode Switcher (Customer Front vs Store Backend) */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-neutral-200/80 shrink-0">
            <button
              type="button"
              id="btn-nav-customer-view"
              onClick={() => setActiveView('customer')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'customer'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>顧客前台</span>
            </button>

            <button
              type="button"
              id="btn-nav-admin-view"
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>門市後台</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Share Link for Current Page */}
            <button
              type="button"
              onClick={() => copyShareLink(activeView)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title={activeView === 'customer' ? '複製顧客訂購前台專屬網址' : '複製門市管理後台專屬網址'}
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-800" />
              <span className="hidden md:inline text-[11px] font-medium">
                {activeView === 'customer' ? '分享前台' : '分享後台'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('確定要將所有菜單、表單、訂單與客戶資料重置為預設展示資料嗎？')) {
                  resetAllData();
                }
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="重置系統為預設資料"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">重置資料</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toast Container */}
      <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-lg border text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150 ${
              t.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-800'
                : t.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-800'
                : 'bg-neutral-900 text-white border-neutral-800'
            }`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
