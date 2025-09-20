export type ProductCategory = 'bags' | 'clothing' | 'accessories' | 'home';

export interface Review {
  author: string;
  authorEn?: string;
  rating: number;
  comment: string;
  commentEn?: string;
  date: Date;
}

export interface ProductVariant {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  stockQuantity: number;
}

export interface ProductAddon {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  currency: 'AED' | 'LE';
  images: string[];
  category: ProductCategory;
  materials: string[];
  colors: string[];
  createdAt: Date;
  featured: boolean;
  reviews: Review[];
  variants: ProductVariant[];
  addons?: ProductAddon[];
}
