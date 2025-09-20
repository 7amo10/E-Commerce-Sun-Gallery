export interface CartVariant {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
}
export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  currency?: string;
  qty: number;
  image?: string;
  variant?: CartVariant;
}
