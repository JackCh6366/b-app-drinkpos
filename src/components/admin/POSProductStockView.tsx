import React, { useState, useMemo } from 'react';
import { useBeverage } from '../../context/BeverageContext';
import { Product, ToppingOption, SugarLevel, IceLevel } from '../../types';
import {
  Package,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Edit,
  Trash2,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  X,
  Save,
} from 'lucide-react';

export const POSProductStockView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    updateProductStockQty,
    toppings,
    addTopping,
    updateTopping,
    toggleToppingStock,
    deleteTopping,
  } = useBeverage();

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'toppings'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock' | 'lowStock'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Topping Input
  const [newToppingName, setNewToppingName] = useState('');
  const [newToppingPrice, setNewToppingPrice] = useState<number>(10);

  // Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['全部', ...Array.from(set)];
  }, [products]);

  // Statistics
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock && p.stockQty > 0).length;
  const lowStockCount = products.filter((p) => p.inStock && p.stockQty > 0 && p.stockQty < 15).length;
  const outOfStockCount = products.filter((p) => !p.inStock || p.stockQty === 0).length;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== '全部' && p.category !== selectedCategory) return false;
      if (stockFilter === 'inStock' && (!p.inStock || p.stockQty === 0)) return false;
      if (stockFilter === 'outOfStock' && (p.inStock && p.stockQty > 0)) return false;
      if (stockFilter === 'lowStock' && (!p.inStock || p.stockQty >= 15)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, selectedCategory, stockFilter, searchQuery]);

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleCreateTopping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToppingName.trim()) return;
    addTopping({
      name: newToppingName.trim(),
      price: Number(newToppingPrice) || 10,
      inStock: true,
    });
    setNewToppingName('');
    setNewToppingPrice(10);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-800" />
            <span>POS 商品設定及庫存管理後台</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            即時管理飲料菜單、各品項庫存數量、開關供貨狀態，並設定加料配料庫存。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'products' && (
            <button
              type="button"
              id="btn-add-new-product"
              onClick={handleOpenNewProduct}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新增飲品商品</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-xs">
          <span className="text-xs font-medium text-neutral-500">總飲品品項</span>
          <div className="text-2xl font-extrabold text-neutral-900 mt-1">{totalProducts} 種</div>
          <span className="text-[11px] text-neutral-400">跨 {categories.length - 1} 大系列</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-800">正常供應中</span>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">{inStockCount} 款</div>
          <span className="text-[11px] text-emerald-700">前台正常展示下單</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 shadow-xs">
          <span className="text-xs font-medium text-amber-800">庫存偏低警戒</span>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">{lowStockCount} 款</div>
          <span className="text-[11px] text-amber-700">庫存少於 15 杯</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 shadow-xs">
          <span className="text-xs font-medium text-rose-800">售罄缺貨中</span>
          <div className="text-2xl font-extrabold text-rose-900 mt-1">{outOfStockCount} 款</div>
          <span className="text-[11px] text-rose-700">前台顯示售完不給點</span>
        </div>
      </div>

      {/* Sub Tabs: 飲料商品清單 vs 加料配料設定 */}
      <div className="flex border-b border-neutral-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveSubTab('products')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeSubTab === 'products'
              ? 'text-emerald-800 border-b-2 border-emerald-800'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          飲品清單與庫存 ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('toppings')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeSubTab === 'toppings'
              ? 'text-emerald-800 border-b-2 border-emerald-800'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          手作加料配料庫存 ({toppings.length})
        </button>
      </div>

      {/* 1. Products Tab Content */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3.5 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === c
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-neutral-50 focus:outline-none"
              >
                <option value="all">全部狀態</option>
                <option value="inStock">正常供應</option>
                <option value="lowStock">庫存偏低 (&lt;15)</option>
                <option value="outOfStock">已售完</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋商品..."
                  className="w-40 text-xs pl-8 pr-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">飲品商品</th>
                    <th className="py-3 px-4">分類</th>
                    <th className="py-3 px-4">價格 (L / M)</th>
                    <th className="py-3 px-4">庫存狀態</th>
                    <th className="py-3 px-4">庫存剩餘量</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-neutral-400">
                        查無符合篩選條件之商品
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-50/70 transition-colors">
                        {/* Name & Photo */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-neutral-900 text-sm">
                                {prod.name}
                              </div>
                              <div className="flex gap-1 mt-0.5">
                                {prod.tags?.map((t) => (
                                  <span
                                    key={t}
                                    className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-medium"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md font-medium">
                            {prod.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-mono font-semibold">
                          <span>${prod.priceL}</span>
                          <span className="text-neutral-400 font-normal ml-1">/ ${prod.priceM}</span>
                        </td>

                        {/* In Stock Toggle */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(prod.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              prod.inStock
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                prod.inStock ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                            <span>{prod.inStock ? '正常供應' : '已設售完'}</span>
                          </button>
                        </td>

                        {/* Stock Quantity */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={prod.stockQty}
                              onChange={(e) =>
                                updateProductStockQty(prod.id, parseInt(e.target.value) || 0)
                              }
                              className={`w-16 px-2 py-1 border rounded-md text-xs font-mono font-bold focus:outline-none ${
                                prod.stockQty === 0
                                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                                  : prod.stockQty < 15
                                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                                  : 'border-neutral-200 bg-white text-neutral-800'
                              }`}
                            />
                            <span className="text-neutral-500">杯</span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => updateProductStockQty(prod.id, prod.stockQty + 20)}
                                className="px-1.5 py-0.5 text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded"
                                title="補貨 +20 杯"
                              >
                                +20
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-neutral-500 hover:text-emerald-800 hover:bg-neutral-100 rounded-md transition-colors"
                              title="編輯商品"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`確定要刪除「${prod.name}」嗎？`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="刪除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Toppings Tab Content */}
      {activeSubTab === 'toppings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Toppings Table */}
          <div className="md:col-span-2 bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
              <h3 className="font-bold text-sm text-neutral-900">加料配料庫存清單</h3>
              <span className="text-xs text-neutral-500">供前台顧客複選客製</span>
            </div>
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">配料名稱</th>
                  <th className="py-3 px-4">加購價格</th>
                  <th className="py-3 px-4">供應狀態</th>
                  <th className="py-3 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {toppings.map((top) => (
                  <tr key={top.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 font-bold text-neutral-900">{top.name}</td>
                    <td className="py-3 px-4 font-mono font-semibold">+${top.price}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleToppingStock(top.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          top.inStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            top.inStock ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        <span>{top.inStock ? '正常供應' : '缺貨中'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => deleteTopping(top.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded"
                        title="刪除配料"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Topping Form */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs h-fit">
            <h3 className="font-bold text-sm text-neutral-900 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-800" />
              <span>新增手作加料配料</span>
            </h3>
            <form onSubmit={handleCreateTopping} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">配料名稱</label>
                <input
                  type="text"
                  required
                  value={newToppingName}
                  onChange={(e) => setNewToppingName(e.target.value)}
                  placeholder="例：黑糖芋圓、雙份奶蓋"
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  加購價格 (NT$)
                </label>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={newToppingPrice}
                  onChange={(e) => setNewToppingPrice(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                新增配料
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {isProductModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setIsProductModalOpen(false)}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data);
            } else {
              addProduct(data as any);
            }
            setIsProductModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || '嚴選純茶');
  const [description, setDescription] = useState(product?.description || '');
  const [priceM, setPriceM] = useState<number>(product?.priceM || 35);
  const [priceL, setPriceL] = useState<number>(product?.priceL || 45);
  const [image, setImage] = useState(
    product?.image ||
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'
  );
  const [stockQty, setStockQty] = useState<number>(product?.stockQty || 80);
  const [tagInput, setTagInput] = useState(product?.tags?.join(' ') || '');
  const [allowedHot, setAllowedHot] = useState<boolean>(product?.allowedHot ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagInput
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      priceM: Number(priceM),
      priceL: Number(priceL),
      image: image.trim(),
      stockQty: Number(stockQty),
      inStock: Number(stockQty) > 0,
      tags,
      allowedHot,
      allowedIce: true,
      defaultSugar: '微糖 (30%)',
      defaultIce: '微冰',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h3 className="font-bold text-neutral-900 text-base">
            {product ? `編輯飲品：${product.name}` : '新增飲品至 POS'}
          </h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">飲品名稱 *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：紅玉琥珀鮮奶茶"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">分類系列 *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="例：小農鮮奶拿鐵、嚴選純茶"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">初始庫存量 (杯)</label>
              <input
                type="number"
                min={0}
                value={stockQty}
                onChange={(e) => setStockQty(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">中杯價格 (M)</label>
              <input
                type="number"
                min={0}
                value={priceM}
                onChange={(e) => setPriceM(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">大杯價格 (L)</label>
              <input
                type="number"
                min={0}
                value={priceL}
                onChange={(e) => setPriceL(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">特色描述</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="風味、產地或茶感介紹..."
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">商品展示圖 (URL)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              促銷標籤 (以空白分隔)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="例：店長推薦 熱銷 新品"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="check-allow-hot"
              checked={allowedHot}
              onChange={(e) => setAllowedHot(e.target.checked)}
              className="rounded text-emerald-800 focus:ring-emerald-700"
            />
            <label htmlFor="check-allow-hot" className="text-neutral-700 cursor-pointer">
              提供熱飲調製選項 (若純果茶可取消勾選)
            </label>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-100 transition-colors font-medium text-neutral-600"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              儲存商品
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
