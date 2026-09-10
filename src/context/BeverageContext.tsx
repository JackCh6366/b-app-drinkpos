import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  ToppingOption,
  OrderFormConfig,
  Order,
  CustomerProfile,
  CartItem,
  OrderStatus,
  CustomerInfo,
  DeliveryType
} from '../types';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_TOPPINGS,
  DEFAULT_FORMS,
  DEFAULT_ORDERS,
  DEFAULT_CUSTOMERS
} from '../data/mockData';

export type AdminTab = 'products' | 'orders' | 'crm' | 'forms';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface BeverageContextType {
  // Navigation & View
  activeView: 'customer' | 'admin';
  setActiveView: (view: 'customer' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  activeFormId: string;
  setActiveFormId: (id: string) => void;
  currentForm: OrderFormConfig | undefined;
  openCustomerWithForm: (formId: string) => void;
  openAdminWithTab: (tab: AdminTab, formId?: string) => void;
  getShareableUrl: (type: 'customer' | 'admin', formId?: string, tab?: AdminTab) => string;
  copyShareLink: (type: 'customer' | 'admin', formId?: string, tab?: AdminTab) => void;

  // Products & Stock
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  updateProductStockQty: (id: string, qty: number) => void;

  // Toppings
  toppings: ToppingOption[];
  addTopping: (topping: Omit<ToppingOption, 'id'>) => void;
  updateTopping: (id: string, updates: Partial<ToppingOption>) => void;
  toggleToppingStock: (id: string) => void;
  deleteTopping: (id: string) => void;

  // Forms
  forms: OrderFormConfig[];
  createForm: (form: Omit<OrderFormConfig, 'id' | 'createdDate' | 'totalOrdersCount' | 'totalSalesAmount'>) => void;
  updateForm: (id: string, updates: Partial<OrderFormConfig>) => void;
  toggleFormStatus: (id: string) => void;
  deleteForm: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (data: {
    customer: CustomerInfo;
    deliveryType: DeliveryType;
    pickupTime?: string;
    notes?: string;
    paymentMethod: 'cash' | 'linepay' | 'transfer';
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus, cancelReason?: string) => void;
  deleteOrder: (orderId: string) => void;

  // CRM
  customers: CustomerProfile[];
  updateCustomer: (id: string, updates: Partial<CustomerProfile>) => void;
  addCustomerTag: (id: string, tag: string) => void;
  removeCustomerTag: (id: string, tag: string) => void;
  deleteCustomer: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (cartItemId: string, updates: Partial<CartItem>) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotalCups: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartFinalTotal: number;

  // Toast
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Reset to default data
  resetAllData: () => void;
}

const BeverageContext = createContext<BeverageContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'tea_melody_products_v1',
  TOPPINGS: 'tea_melody_toppings_v1',
  FORMS: 'tea_melody_forms_v1',
  ORDERS: 'tea_melody_orders_v1',
  CUSTOMERS: 'tea_melody_customers_v1',
  CART: 'tea_melody_cart_v1',
  ACTIVE_FORM: 'tea_melody_active_form_v1',
};

export const BeverageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation - initialized from URL parameters so shared links can open customer or admin view
  const [activeView, setActiveView] = useState<'customer' | 'admin'>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'admin' || viewParam === 'customer') return viewParam;
    return 'customer';
  });

  const [adminTab, setAdminTab] = useState<AdminTab>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as AdminTab;
    if (['products', 'orders', 'crm', 'forms'].includes(tabParam)) return tabParam;
    return 'orders';
  });
  
  // Data State with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [toppings, setToppings] = useState<ToppingOption[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOPPINGS);
    return saved ? JSON.parse(saved) : DEFAULT_TOPPINGS;
  });

  const [forms, setForms] = useState<OrderFormConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FORMS);
    return saved ? JSON.parse(saved) : DEFAULT_FORMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeFormId, setActiveFormId] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('formId');
    if (fromUrl) return fromUrl;
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_FORM);
    return saved || (DEFAULT_FORMS[0]?.id ?? 'form-tea-afternoon');
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOPPINGS, JSON.stringify(toppings));
  }, [toppings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FORM, activeFormId);
  }, [activeFormId]);

  // Synchronize browser URL parameters without reloading so links reflect current view
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', activeView);
      if (activeView === 'admin') {
        url.searchParams.set('tab', adminTab);
      } else {
        url.searchParams.delete('tab');
      }
      if (activeFormId) {
        url.searchParams.set('formId', activeFormId);
      }
      window.history.replaceState(null, '', `${url.pathname}${url.search}`);
    } catch {
      // Ignore if URL api fails in non-standard context
    }
  }, [activeView, adminTab, activeFormId]);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'admin' || v === 'customer') setActiveView(v);
      const t = params.get('tab') as AdminTab;
      if (['products', 'orders', 'crm', 'forms'].includes(t)) setAdminTab(t);
      const f = params.get('formId');
      if (f) setActiveFormId(f);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize cross-tab / cross-window updates (e.g. customer places order in one tab, admin sees it in another)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEYS.ORDERS) setOrders(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.PRODUCTS) setProducts(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.FORMS) setForms(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.CUSTOMERS) setCustomers(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.TOPPINGS) setToppings(JSON.parse(e.newValue));
      } catch (err) {
        console.error('Failed to sync storage', err);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Current active form
  const currentForm = useMemo(() => {
    return forms.find((f) => f.id === activeFormId) || forms[0];
  }, [forms, activeFormId]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch to customer view with specific form
  const openCustomerWithForm = (formId: string) => {
    setActiveFormId(formId);
    setActiveView('customer');
    showToast(`已切換至「${forms.find(f => f.id === formId)?.title || '表單'}」訂購前台`, 'info');
  };

  // Switch to admin view with specific tab and form
  const openAdminWithTab = (tab: AdminTab, formId?: string) => {
    if (formId) setActiveFormId(formId);
    setAdminTab(tab);
    setActiveView('admin');
    showToast('已切換至門市管理後台', 'info');
  };

  // Generate shareable URLs for customer or admin
  const getShareableUrl = (type: 'customer' | 'admin', formId?: string, tab?: AdminTab) => {
    const targetFormId = formId || activeFormId;
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    if (type === 'admin') {
      const targetTab = tab || adminTab || 'orders';
      return `${origin}${pathname}?view=admin&tab=${targetTab}${targetFormId ? `&formId=${targetFormId}` : ''}`;
    }
    return `${origin}${pathname}?view=customer${targetFormId ? `&formId=${targetFormId}` : ''}`;
  };

  const copyShareLink = (type: 'customer' | 'admin', formId?: string, tab?: AdminTab) => {
    const url = getShareableUrl(type, formId, tab);
    navigator.clipboard.writeText(url);
    if (type === 'admin') {
      showToast('已複製「門市管理後台」專屬連結至剪貼簿！', 'info');
    } else {
      showToast('已複製「顧客訂購前台」專屬連結至剪貼簿！', 'success');
    }
  };

  // Products CRUD
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: `p-${Date.now()}`,
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`成功新增商品：${product.name}`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('商品資料已更新');
  };

  const deleteProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
    showToast(`已刪除商品：${p?.name || id}`, 'warning');
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newInStock = !p.inStock;
          showToast(`${p.name} 已切換為 ${newInStock ? '供應中 (有庫存)' : '已售完 (無庫存)'}`, newInStock ? 'success' : 'warning');
          return { ...p, inStock: newInStock };
        }
        return p;
      })
    );
  };

  const updateProductStockQty = (id: string, qty: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stockQty: Math.max(0, qty), inStock: qty > 0 } : p
      )
    );
  };

  // Toppings CRUD
  const addTopping = (newTop: Omit<ToppingOption, 'id'>) => {
    const topping: ToppingOption = {
      ...newTop,
      id: `t-${Date.now()}`,
    };
    setToppings((prev) => [...prev, topping]);
    showToast(`已新增配料：${topping.name}`);
  };

  const updateTopping = (id: string, updates: Partial<ToppingOption>) => {
    setToppings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const toggleToppingStock = (id: string) => {
    setToppings((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.inStock;
          showToast(`配料 ${t.name} 已切換為 ${next ? '正常供應' : '缺貨中'}`);
          return { ...t, inStock: next };
        }
        return t;
      })
    );
  };

  const deleteTopping = (id: string) => {
    setToppings((prev) => prev.filter((t) => t.id !== id));
    showToast('已刪除加料配料');
  };

  // Forms CRUD
  const createForm = (formData: Omit<OrderFormConfig, 'id' | 'createdDate' | 'totalOrdersCount' | 'totalSalesAmount'>) => {
    const newForm: OrderFormConfig = {
      ...formData,
      id: `form-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      totalOrdersCount: 0,
      totalSalesAmount: 0,
    };
    setForms((prev) => [newForm, ...prev]);
    showToast(`成功生成新表單連結：${newForm.title}`);
  };

  const updateForm = (id: string, updates: Partial<OrderFormConfig>) => {
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
    showToast('表單設定已儲存');
  };

  const toggleFormStatus = (id: string) => {
    setForms((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const next = !f.isActive;
          showToast(`表單「${f.title}」已設定為 ${next ? '開放接單' : '已關閉/暫停'}`);
          return { ...f, isActive: next };
        }
        return f;
      })
    );
  };

  const deleteForm = (id: string) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
    showToast('已移除該訂購表單', 'warning');
  };

  // Cart Management
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if identical item (same product, size, sugar, ice, toppings)
      const existingIdx = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.sugar === item.sugar &&
          i.ice === item.ice &&
          JSON.stringify(i.toppings.map((t) => t.id).sort()) ===
            JSON.stringify(item.toppings.map((t) => t.id).sort()) &&
          i.notes === item.notes
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        const updated = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + item.quantity,
          totalPrice: copy[existingIdx].totalPrice + item.totalPrice,
        };
        copy[existingIdx] = updated;
        return copy;
      }
      return [...prev, item];
    });
    showToast(`已加入購物車：${item.name} (${item.size}杯) x${item.quantity}`);
  };

  const updateCartItem = (cartItemId: string, updates: Partial<CartItem>) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const qty = updates.quantity !== undefined ? updates.quantity : item.quantity;
          const unit = updates.unitPrice !== undefined ? updates.unitPrice : item.unitPrice;
          const topSum = (updates.toppings || item.toppings).reduce((s, t) => s + t.price, 0);
          return {
            ...item,
            ...updates,
            quantity: qty,
            totalPrice: (unit + topSum) * qty,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('已從購物車移除品項', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart Totals calculation based on currentForm rules
  const cartTotalCups = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!currentForm || !currentForm.discountThreshold || !currentForm.discountRate) return 0;
    if (cartSubtotal >= currentForm.discountThreshold) {
      return Math.round(cartSubtotal * (1 - currentForm.discountRate));
    }
    return 0;
  }, [cartSubtotal, currentForm]);

  const cartDeliveryFee = useMemo(() => {
    // 0 by default for pickup; calculated at checkout based on delivery type
    return 0;
  }, []);

  const cartFinalTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount);
  }, [cartSubtotal, cartDiscount]);

  // Orders Management & CRM Auto-Ingest
  const createOrder = ({
    customer,
    deliveryType,
    pickupTime,
    notes,
    paymentMethod,
  }: {
    customer: CustomerInfo;
    deliveryType: DeliveryType;
    pickupTime?: string;
    notes?: string;
    paymentMethod: 'cash' | 'linepay' | 'transfer';
  }): Order | null => {
    if (cart.length === 0) {
      showToast('購物車內尚無飲品', 'warning');
      return null;
    }

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(orders.length + 1).padStart(3, '0');
    const orderNumber = `#TM-${todayStr}-${seq}`;
    const orderId = `ord-${Date.now()}`;

    const deliveryFee =
      deliveryType === 'delivery' &&
      currentForm &&
      cartSubtotal < currentForm.deliveryFeeThreshold
        ? 50
        : 0;

    const finalAmount = cartSubtotal - cartDiscount + deliveryFee;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      formId: currentForm?.id,
      formTitle: currentForm?.title,
      customer,
      deliveryType,
      pickupTime: pickupTime || (deliveryType === 'pickup' ? '15分鐘後取餐' : '約30-45分鐘內送達'),
      notes,
      items: [...cart],
      totalCups: cartTotalCups,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee,
      totalAmount: finalAmount,
      status: 'pending',
      paymentMethod,
    };

    // 1. Add order
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Deduct product inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const purchasedQty = cart
          .filter((item) => item.productId === prod.id)
          .reduce((sum, item) => sum + item.quantity, 0);

        if (purchasedQty > 0) {
          const newQty = Math.max(0, prod.stockQty - purchasedQty);
          return {
            ...prod,
            stockQty: newQty,
            inStock: newQty > 0,
          };
        }
        return prod;
      })
    );

    // 3. Update Form statistics
    if (currentForm) {
      setForms((prev) =>
        prev.map((f) =>
          f.id === currentForm.id
            ? {
                ...f,
                totalOrdersCount: f.totalOrdersCount + 1,
                totalSalesAmount: f.totalSalesAmount + finalAmount,
              }
            : f
        )
      );
    }

    // 4. Auto ingest / update CRM Customer
    const normalizedPhone = customer.phone.replace(/[-\s]/g, '');
    setCustomers((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.phone.replace(/[-\s]/g, '') === normalizedPhone
      );

      const todayIso = new Date().toISOString().split('T')[0];

      if (existingIdx > -1) {
        const existing = prev[existingIdx];
        const newTotalSpent = existing.totalSpent + finalAmount;
        const newTotalOrders = existing.totalOrders + 1;

        // Auto tag VIP if spent > 3000 or orders > 5
        const tags = [...existing.tags];
        if (newTotalSpent >= 3000 && !tags.includes('VIP大戶')) {
          tags.push('VIP大戶');
        }
        if (newTotalOrders >= 5 && !tags.includes('常客')) {
          tags.push('常客');
        }

        const updated: CustomerProfile = {
          ...existing,
          name: customer.name || existing.name,
          email: customer.email || existing.email,
          address: customer.address || existing.address,
          totalOrders: newTotalOrders,
          totalSpent: newTotalSpent,
          lastOrderDate: todayIso,
          orderIds: [orderId, ...existing.orderIds],
          tags,
        };

        const copy = [...prev];
        copy[existingIdx] = updated;
        return copy;
      } else {
        // Create new customer profile
        const newCust: CustomerProfile = {
          id: `crm-${Date.now()}`,
          phone: customer.phone,
          name: customer.name,
          email: customer.email,
          address: customer.address,
          totalOrders: 1,
          totalSpent: finalAmount,
          firstOrderDate: todayIso,
          lastOrderDate: todayIso,
          tags: ['新客戶'],
          notes: deliveryType === 'delivery' ? '首次線上外送訂購' : '首次自取訂購',
          orderIds: [orderId],
        };
        return [newCust, ...prev];
      }
    });

    // 5. Clear Cart
    clearCart();
    showToast(`訂單 ${orderNumber} 已成功送出！`, 'success');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, cancelReason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const statusMap: Record<OrderStatus, string> = {
            pending: '待確認',
            preparing: '製作中',
            delivering_ready: '外送中/待取',
            completed: '已完成',
            cancelled: '已取消',
          };
          showToast(`訂單 ${ord.orderNumber} 狀態更新為：${statusMap[status]}`);
          return { ...ord, status, cancelReason: cancelReason || ord.cancelReason };
        }
        return ord;
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('已刪除該筆訂單記錄', 'info');
  };

  // CRM Management
  const updateCustomer = (id: string, updates: Partial<CustomerProfile>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('顧客資訊已更新');
  };

  const addCustomerTag = (id: string, tag: string) => {
    if (!tag.trim()) return;
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id && !c.tags.includes(tag.trim())) {
          return { ...c, tags: [...c.tags, tag.trim()] };
        }
        return c;
      })
    );
  };

  const removeCustomerTag = (id: string, tag: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, tags: c.tags.filter((t) => t !== tag) } : c
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast('已移除顧客資料', 'info');
  };

  const resetAllData = () => {
    setProducts(DEFAULT_PRODUCTS);
    setToppings(DEFAULT_TOPPINGS);
    setForms(DEFAULT_FORMS);
    setOrders(DEFAULT_ORDERS);
    setCustomers(DEFAULT_CUSTOMERS);
    setCart([]);
    localStorage.clear();
    showToast('已重置為預設展示資料', 'info');
  };

  return (
    <BeverageContext.Provider
      value={{
        activeView,
        setActiveView,
        adminTab,
        setAdminTab,
        activeFormId,
        setActiveFormId,
        currentForm,
        openCustomerWithForm,
        openAdminWithTab,
        getShareableUrl,
        copyShareLink,

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

        forms,
        createForm,
        updateForm,
        toggleFormStatus,
        deleteForm,

        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,

        customers,
        updateCustomer,
        addCustomerTag,
        removeCustomerTag,
        deleteCustomer,

        cart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartTotalCups,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartFinalTotal,

        toasts,
        showToast,
        dismissToast,

        resetAllData,
      }}
    >
      {children}
    </BeverageContext.Provider>
  );
};

export const useBeverage = () => {
  const context = useContext(BeverageContext);
  if (!context) {
    throw new Error('useBeverage must be used within a BeverageProvider');
  }
  return context;
};
