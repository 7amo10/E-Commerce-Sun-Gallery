import { Injectable, computed, inject } from "@angular/core";
import { OrderService } from "./order.service";
import { ProductService } from "./product.service";

@Injectable({ providedIn: "root" })
export class AdminService {
  private orders = inject(OrderService).list;
  private products = inject(ProductService).products;

  readonly totalSales = computed(() =>
    this.orders().reduce((sum, order) => {
      const totals = order.totals ?? {};
      const total = Object.values(totals as Record<string, number>).reduce(
        (a: number, b: number) => a + b,
        0,
      );
      return sum + total;
    }, 0),
  );
  readonly totalOrders = computed(() => this.orders().length);
  readonly latestOrders = computed(() => this.orders().slice(-5));

  readonly totalStock = computed(() =>
    this.products().reduce(
      (sum, p) =>
        sum +
        p.variants.reduce((variantSum, v) => variantSum + v.stockQuantity, 0),
      0,
    ),
  );
  readonly outOfStockProducts = computed(
    () =>
      this.products().filter((p) =>
        p.variants.every((v) => v.stockQuantity === 0),
      ).length,
  );

  readonly salesByDay = computed(() => {
    const sales: number[] = Array(7).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const order of this.orders()) {
      const dateVal = order.date ?? new Date();
      const orderDate = new Date(dateVal);
      orderDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays >= 0 && diffDays < 7) {
        const totals = order.totals ?? {};
        const sum = Object.values(totals as Record<string, number>).reduce(
          (a: number, b: number) => a + b,
          0,
        );
        sales[6 - diffDays] += sum;
      }
    }
    return sales;
  });
}
