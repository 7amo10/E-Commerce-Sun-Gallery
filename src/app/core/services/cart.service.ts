import { Injectable, computed, signal } from '@angular/core';
import { ProductAddon, ProductVariant } from '../../shared/models/product.model';

export interface CartItem {
  id: string; // Composite ID: e.g. {productId}-{variantId}-{addons.join('-')}
  productId: string;
  name: string; // e.g. "Classic Crochet Bag - Medium"
  price: number; // Final price per unit (variant + addons)
  currency: 'AED' | 'LE';
  qty: number;
  image?: string;
  variant: ProductVariant;
  addons?: ProductAddon[];
}

// Changed to v2 to invalidate old carts from localStorage
const STORAGE_KEY = 'sun-gallery-cart-v2';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>(this.load());

  readonly list = this.items.asReadonly();

  // Replaced `total` with `totalsByCurrency` to handle multiple currencies
  readonly totalsByCurrency = computed(() => {
    return this.items().reduce(
      (acc, item) => {
        const currency = item.currency || 'AED'; // Default currency for safety
        if (!acc[currency]) {
          acc[currency] = 0;
        }
        acc[currency] += item.price * item.qty;
        return acc;
      },
      {} as { [key: string]: number },
    );
  });

  readonly count = computed(() =>
    this.items().reduce((s, i) => s + i.qty, 0),
  );

  // Updated `add` method to be immutable
  add(item: CartItem) {
    const existing = this.items().find(i => i.id === item.id);
    if (existing) {
      this.items.update(v =>
        v.map(i => (i.id === item.id ? { ...i, qty: i.qty + item.qty } : i)),
      );
    } else {
      this.items.update(v => [...v, item]);
    }
    this.persist();
  }

  remove(id: string) {
    this.items.update(v => v.filter(i => i.id !== id));
    this.persist();
  }

  updateQty(id: string, qty: number) {
    this.items.update(v =>
      v.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );
    this.persist();
  }

  clear() {
    this.items.set([]);
    this.persist();
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }

  private load(): CartItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
