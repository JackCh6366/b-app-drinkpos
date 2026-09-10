import React, { useState, useMemo } from 'react';
import { useBeverage } from '../../context/BeverageContext';
import { CustomerProfile, Order } from '../../types';
import {
  Users,
  Search,
  Crown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Download,
  Plus,
  X,
  Edit,
  ClipboardList,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const CRMView: React.FC = () => {
  const {
    customers,
    orders,
    updateCustomer,
    addCustomerTag,
    removeCustomerTag,
    deleteCustomer,
    showToast,
  } = useBeverage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [activeCustomerDetail, setActiveCustomerDetail] = useState<CustomerProfile | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    customers.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return ['全部', ...Array.from(set)];
  }, [customers]);

  // Statistics
  const totalCustomers = customers.length;
  const vipCount = customers.filter(
    (c) => c.tags.includes('VIP大戶') || c.totalSpent >= 3000
  ).length;

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrdersCount = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const avgOrderValue =
    totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (selectedTag !== '全部' && !c.tags.includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().replace(/[-\s]/g, '');
        const phone = c.phone.replace(/[-\s]/g, '').toLowerCase();
        const name = c.name.toLowerCase();
        const email = (c.email || '').toLowerCase();
        const address = (c.address || '').toLowerCase();
        return phone.includes(q) || name.includes(q) || email.includes(q) || address.includes(q);
      }
      return true;
    });
  }, [customers, selectedTag, searchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      '顧客姓名',
      '聯絡電話',
      'Email',
      '常用地址',
      '累計訂單數',
      '累計消費金額',
      '客單價',
      '首次消費日',
      '最後消費日',
      '標籤',
      '備忘筆記',
    ];

    const rows = filteredCustomers.map((c) => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.address || ''}"`,
      c.totalOrders,
      c.totalSpent,
      Math.round(c.totalSpent / c.totalOrders),
      c.firstOrderDate,
      c.lastOrderDate,
      `"${c.tags.join(';')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `CRM_Customers_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('已匯出 CRM 顧客名單 CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <span>CRM 客戶管理後台</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            顧客於前台下單時依電話自動歸戶，記錄消費頻率、累積消費金額、偏好飲品與貼上客製化標籤。
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3.5 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>匯出 CRM 客戶 CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-xs">
          <span className="text-xs font-medium text-neutral-500">總建檔客戶數</span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1">{totalCustomers} 位</div>
          <span className="text-[11px] text-neutral-400">依電話唯一歸戶</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800">VIP 大戶 / 熟客</span>
            <Crown className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">{vipCount} 位</div>
          <span className="text-[11px] text-amber-700">消費 &gt; $3,000 或常客</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-800">平均顧客消費額</span>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">
            ${totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0}
          </div>
          <span className="text-[11px] text-emerald-700">LTV 顧客終身價值</span>
        </div>

        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 shadow-xs">
          <span className="text-xs font-medium text-sky-800">平均單筆客單價 (AOV)</span>
          <div className="text-2xl font-extrabold text-sky-900 mt-1">${avgOrderValue}</div>
          <span className="text-[11px] text-sky-700">共 {totalOrdersCount} 筆累積訂單</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋姓名、手機、Email..."
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">顧客姓名 / 標籤</th>
                <th className="py-3 px-4">手機電話</th>
                <th className="py-3 px-4">Email 信箱</th>
                <th className="py-3 px-4">常用配送地址</th>
                <th className="py-3 px-4 text-center">次數 / 總消費</th>
                <th className="py-3 px-4">最後下單日</th>
                <th className="py-3 px-4 text-right">詳情操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-400">
                    查無符合條件之客戶資料
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isVip = cust.tags.includes('VIP大戶') || cust.totalSpent >= 3000;
                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                      onClick={() => setActiveCustomerDetail(cust)}
                    >
                      {/* Name & Tags */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 text-sm">{cust.name}</span>
                          {isVip && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold text-[10px] flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5" />
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cust.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 font-mono font-medium text-emerald-900">
                        {cust.phone}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-neutral-500">
                        {cust.email || '-'}
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4 max-w-xs truncate text-neutral-600">
                        {cust.address || '(自取 / 未填地址)'}
                      </td>

                      {/* Orders & Spent */}
                      <td className="py-3 px-4 text-center">
                        <div className="font-bold text-neutral-900">{cust.totalOrders} 次</div>
                        <div className="font-mono text-emerald-800 font-semibold mt-0.5">
                          ${cust.totalSpent.toLocaleString()}
                        </div>
                      </td>

                      {/* Last Date */}
                      <td className="py-3 px-4 text-neutral-500 font-mono">
                        {cust.lastOrderDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCustomerDetail(cust);
                          }}
                          className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <span>查看紀錄</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {activeCustomerDetail && (
        <CustomerDetailModal
          customer={activeCustomerDetail}
          orders={orders.filter((o) =>
            activeCustomerDetail.orderIds.includes(o.id) ||
            o.customer.phone.replace(/[-\s]/g, '') ===
              activeCustomerDetail.phone.replace(/[-\s]/g, '')
          )}
          onClose={() => setActiveCustomerDetail(null)}
          onUpdateCustomer={(updates) => {
            updateCustomer(activeCustomerDetail.id, updates);
            setActiveCustomerDetail({ ...activeCustomerDetail, ...updates });
          }}
          onAddTag={(tag) => {
            addCustomerTag(activeCustomerDetail.id, tag);
            setActiveCustomerDetail({
              ...activeCustomerDetail,
              tags: [...activeCustomerDetail.tags, tag],
            });
          }}
          onRemoveTag={(tag) => {
            removeCustomerTag(activeCustomerDetail.id, tag);
            setActiveCustomerDetail({
              ...activeCustomerDetail,
              tags: activeCustomerDetail.tags.filter((t) => t !== tag),
            });
          }}
        />
      )}
    </div>
  );
};

interface CustomerDetailModalProps {
  customer: CustomerProfile;
  orders: Order[];
  onClose: () => void;
  onUpdateCustomer: (updates: Partial<CustomerProfile>) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  orders,
  onClose,
  onUpdateCustomer,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [notes, setNotes] = useState(customer.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    onAddTag(newTagInput.trim());
    setNewTagInput('');
  };

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    onUpdateCustomer({ notes: notes.trim() });
    setTimeout(() => setIsSavingNotes(false), 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
              {customer.name.slice(0, 1)}
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-1.5">
                <span>{customer.name}</span>
                {customer.tags.includes('VIP大戶') && (
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[10px] font-bold">
                    VIP
                  </span>
                )}
              </h3>
              <p className="text-xs text-neutral-500 font-mono">{customer.phone}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-neutral-800">
          {/* Customer Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <span className="text-neutral-500 text-[11px]">累計訂單次數</span>
              <div className="text-lg font-extrabold text-neutral-900 mt-0.5">
                {customer.totalOrders} 次
              </div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <span className="text-neutral-500 text-[11px]">累計消費總額</span>
              <div className="text-lg font-extrabold text-emerald-900 mt-0.5">
                ${customer.totalSpent.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <span className="text-neutral-500 text-[11px]">平均客單價</span>
              <div className="text-lg font-extrabold text-neutral-900 mt-0.5">
                ${Math.round(customer.totalSpent / customer.totalOrders)}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-500">Email:</span>
              <span className="font-mono text-neutral-800">{customer.email || '未填寫'}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span className="text-neutral-500 shrink-0">常用配送地址:</span>
              <span className="text-neutral-800">{customer.address || '無 (以自取為主)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-500">首次下單:</span>
              <span className="font-mono text-neutral-700">{customer.firstOrderDate}</span>
              <span className="text-neutral-300">|</span>
              <span className="text-neutral-500">最後消費:</span>
              <span className="font-mono text-neutral-700">{customer.lastOrderDate}</span>
            </div>
          </div>

          {/* Tags Management */}
          <div>
            <h4 className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
              <span>客戶標籤與偏好</span>
              <span className="text-neutral-400 font-normal">點擊 × 可移除標籤</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {customer.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium flex items-center gap-1"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveTag(t)}
                    className="hover:text-rose-600 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddTagSubmit} className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="新增標籤 (例: 愛喝烏龍、公司統編戶、常點少冰)..."
                className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-neutral-800 text-white font-bold rounded-lg hover:bg-neutral-900 transition-colors"
              >
                新增
              </button>
            </form>
          </div>

          {/* Notes */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                內部備忘筆記 (喜好紀錄、特殊要求)
              </label>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
              >
                {isSavingNotes ? '已儲存！' : '儲存筆記'}
              </button>
            </div>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="輸入客戶專屬備忘..."
              className="w-full p-2.5 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>

          {/* Lifetime Orders History */}
          <div>
            <h4 className="font-bold text-neutral-700 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-neutral-500" />
              <span>該顧客歷次訂購紀錄 ({orders.length} 筆)</span>
            </h4>

            {orders.length === 0 ? (
              <p className="text-neutral-400 py-4 text-center bg-neutral-50 rounded-xl">
                目前尚無關聯訂單記錄
              </p>
            ) : (
              <div className="space-y-2">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-neutral-900">
                        {ord.orderNumber}
                      </span>
                      <span className="font-bold text-emerald-900">${ord.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-neutral-500 text-[11px]">
                      <span>{ord.createdAt}</span>
                      <span>
                        {ord.deliveryType === 'delivery' ? '外送' : '自取'} • 共 {ord.totalCups} 杯
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-600 pt-1 border-t border-neutral-200/60">
                      {ord.items.map((i) => `${i.name}(${i.size})x${i.quantity}`).join('、')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
