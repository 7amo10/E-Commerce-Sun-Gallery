export type OrderStatus =
  | "pending"
  | "in_progress"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered";

export interface Address {
  city: string;
  street?: string;
  phone?: string;
  notes?: string;
}
export interface CustomerInfo {
  name: string;
  email?: string;
  phone: string;
}
export interface OrderItem {
  productId?: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  currency?: string;
  variant?: any;
}

export interface Order {
  id: string;
  // legacy fields
  customerId?: string;
  customerInfo?: CustomerInfo;
  shippingAddress?: Address;
  totalAmount?: number;
  specialRequests?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // new fields used by services/pages
  customerName?: string;
  address?: string;
  phone?: string;
  items: OrderItem[];
  totals?: { [key: string]: number };
  date?: Date;
  status: OrderStatus;
}
