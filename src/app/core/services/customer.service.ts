import { Injectable, computed, inject } from "@angular/core";
import { OrderService } from "./order.service";

export interface Customer {
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
}

@Injectable({ providedIn: "root" })
export class CustomerService {
  private orders = inject(OrderService).list;

  readonly customers = computed(() => {
    const customerMap = new Map<string, Customer>();
    for (const order of this.orders()) {
      const key = `${order.customerName ?? order.customerInfo?.name ?? "Unknown"}-${order.phone ?? order.customerInfo?.phone ?? ""}`;
      const totals = order.totals ?? {};
      const orderTotal = Object.values(totals as Record<string, number>).reduce(
        (acc: number, val: number) => acc + val,
        0,
      );

      if (customerMap.has(key)) {
        const existing = customerMap.get(key)!;
        existing.orderCount++;
        existing.totalSpent += orderTotal;
      } else {
        customerMap.set(key, {
          name: order.customerName ?? order.customerInfo?.name ?? "Unknown",
          phone: order.phone ?? order.customerInfo?.phone ?? "",
          address: order.address ?? order.shippingAddress?.street ?? "",
          orderCount: 1,
          totalSpent: orderTotal,
        });
      }
    }
    return Array.from(customerMap.values());
  });
}
