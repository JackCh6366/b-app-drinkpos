import React from 'react';
import { useBeverage, AdminTab } from '../../context/BeverageContext';
import { POSProductStockView } from './POSProductStockView';
import { POSOrderView } from './POSOrderView';
import { CRMView } from './CRMView';
import { FormManagerView } from './FormManagerView';
import {
  Package,
  ClipboardList,
  Users,
  FileCode2,
  ArrowLeft,
  Store,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminTab, setAdminTab, setActiveView, orders } = useBeverage();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const tabs: Array<{
    id: AdminTab;
    label: string;
    subLabel: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      id: 'products',
      label: '1. POS 商品與庫存',
      subLabel: '菜單設定 / 庫存調配',
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: 'orders',
      label: '2. POS 訂單管理',
      subLabel: '接單製作 / 杯貼出單',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: pendingOrdersCount,
    },
    {
      id: 'crm',
      label: '3. CRM 客戶管理',
      subLabel: '電話自動歸戶 / 偏好',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'forms',
      label: '4. 表單生成管理',
      subLabel: '生成專屬前台訂購連結',
      icon: <FileCode2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100/60 pb-16">
      {/* Sub Header for Admin Tabs */}
      <div className="bg-white border-b border-neutral-200 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2 border-b border-neutral-100 md:border-none">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-900 rounded-lg">
                <Store className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                茶韻手作 • 門市總控後台
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveView('customer')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回顧客訂購前台</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {tabs.map((tab) => {
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`btn-admin-tab-${tab.id}`}
                  onClick={() => setAdminTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab.icon}
                  <div className="text-left">
                    <div>{tab.label}</div>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-amber-500 text-white animate-pulse'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {adminTab === 'products' && <POSProductStockView />}
        {adminTab === 'orders' && <POSOrderView />}
        {adminTab === 'crm' && <CRMView />}
        {adminTab === 'forms' && <FormManagerView />}
      </div>
    </div>
  );
};
