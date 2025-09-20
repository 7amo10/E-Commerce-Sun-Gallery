import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { OrderService } from "../../core/services/order.service";
import { Order } from "../../shared/models/order.model";
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";

@Component({
  selector: "app-orders-page",
  standalone: true,
  imports: [CommonModule, OrderSummaryComponent],
  template: `
    <div class="container py-10">
      <h1 class="text-2xl font-extrabold text-gray-900 mb-6">تفاصيل الطلب</h1>
      <div *ngIf="order" class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
            <h2 class="text-lg font-bold mb-2">معلومات الزبون</h2>
            <p><strong>الإسم:</strong> {{ order.customerName }}</p>
            <p><strong>العنوان:</strong> {{ order.address }}</p>
            <p><strong>الهاتف:</strong> {{ order.phone }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
            <h2 class="text-lg font-bold mb-2">المنتجات</h2>
            <div
              *ngFor="let i of order.items"
              class="flex items-center gap-4 py-2 border-b last:border-0"
            >
              <img [src]="i.image" class="h-16 w-16 object-cover rounded-lg" />
              <div class="flex-1">
                <div class="font-bold">{{ i.name }}</div>
                <div class="text-sm text-gray-600">
                  {{
                    i.price | currency: i.currency : "symbol-narrow" : "1.0-0"
                  }}
                  x {{ i.qty }}
                </div>
              </div>
              <div class="font-bold">
                {{
                  i.price * i.qty
                    | currency: i.currency : "symbol-narrow" : "1.0-0"
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div class="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
            <h2 class="text-lg font-bold mb-2">حالة الطلب</h2>
            <p
              class="font-bold text-2xl"
              [class.text-amber-600]="order.status === 'Pending'"
              [class.text-blue-600]="order.status === 'Processing'"
              [class.text-green-600]="order.status === 'Delivered'"
            >
              {{ order.status }}
            </p>
          </div>
          <app-order-summary [totals]="order.totals || {}"></app-order-summary>
        </div>
      </div>
    </div>
  `,
})
export class OrdersPage {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  order: Order | undefined;

  constructor() {
    const orderId = this.route.snapshot.paramMap.get("id");
    if (orderId) {
      this.order = this.orderService.getOrderById(orderId);
    }
  }
}
