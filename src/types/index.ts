export type SugarLevel = '全糖 (100%)' | '少糖 (70%)' | '半糖 (50%)' | '微糖 (30%)' | '一分糖 (10%)' | '無糖 (0%)';
export type IceLevel = '正常冰' | '少冰' | '微冰' | '去冰' | '完全去冰' | '常溫' | '溫熱';
export type CupSize = 'M' | 'L';

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  priceM: number;
  priceL: number;
  image: string;
  tags?: string[]; // e.g., '人氣熱銷', '店長推薦', '新品上市'
  inStock: boolean;
  stockQty: number; // 庫存數量 (杯)
  allowedIce?: boolean;
  allowedHot?: boolean;
  defaultSugar?: SugarLevel;
  defaultIce?: IceLevel;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  category: string;
  size: CupSize;
  unitPrice: number;
  sugar: SugarLevel;
  ice: IceLevel;
  toppings: ToppingOption[];
  notes: string;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'delivering_ready' | 'completed' | 'cancelled';
export type DeliveryType = 'pickup' | 'delivery';

export interface CustomerInfo {
  name: string;
  phone: string;
  address?: string; // 可填可不填
  email?: string;   // email 欄位
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #TM-20260910-001
  createdAt: string;
  formId?: string; // 來源自哪個表單生成連結
  formTitle?: string;
  customer: CustomerInfo;
  deliveryType: DeliveryType;
  pickupTime?: string;
  notes?: string;
  items: CartItem[];
  totalCups: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'linepay' | 'transfer';
  cancelReason?: string;
}

export interface CustomerProfile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  tags: string[]; // e.g. 'VIP大戶', '公司福委', '常客', '偏好無糖'
  notes: string;
  orderIds: string[];
}

export interface OrderFormConfig {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerNotice: string;
  isActive: boolean;
  deadline?: string; // 截止時間
  deliveryFeeThreshold: number; // 滿額免運
  discountThreshold?: number; // 滿額打折
  discountRate?: number; // 例如 0.9 (九折)
  allowedProductIds: string[]; // 表單限定商品（空代表全部可選）
  createdDate: string;
  totalOrdersCount: number;
  totalSalesAmount: number;
}
