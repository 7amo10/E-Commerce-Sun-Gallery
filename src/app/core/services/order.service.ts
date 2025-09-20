import { Injectable, signal } from '@angular/core';
import { CartItem } from '../../shared/models/cart.model';
import { Order } from '../../shared/models/order.model';

const STORAGE_key = 'sun-gallery-orders-v2';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders = signal<Order[]>(this.load());

  readonly list = this.orders.asReadonly();

  placeOrder(
    customerName: string,
    address: string,
    phone: string,
    items: CartItem[],
    totals: { [key: string]: number },
  ) {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      customerName,
      address,
      phone,
      items,
      totals,
      date: new Date(),
      status: 'Pending',
    };
    this.orders.update(v => [...v, newOrder]);
    this.persist();
    return newOrder;
  }

  updateOrder(updatedOrder: Order) {
    this.orders.update(v =>
      v.map(order => (order.id === updatedOrder.id ? updatedOrder : order)),
    );
    this.persist();
  }

  getOrderById(id: string) {
    return this.orders().find(order => order.id === id);
  }

  private persist() {
    localStorage.setItem(STORAGE_key, JSON.stringify(this.orders()));
  }

  private load(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_key);
      if (data) {
        const orders = JSON.parse(data);
        // Quick check to see if the data is in the old format
        if (orders.length > 0 && orders[0].total) {
          // Data is in the old format, clear it to avoid issues.
          // A more robust solution would be a migration script.
          localStorage.removeItem(STORAGE_key);
          return [];
        }
        return orders;
      }
      return [];
    } catch {
      return [];
    }
  }
}
