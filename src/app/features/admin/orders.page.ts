import { Component, inject } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { AdminSidebarComponent } from "../../shared/components/admin-sidebar/admin-sidebar.component";
import { OrderService } from "../../core/services/order.service";
import { Order } from "../../shared/models/order.model";
import { I18nService } from "../../core/services/i18n.service";

@Component({
  selector: "app-admin-orders-page",
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, CurrencyPipe],
  template: `
    <div class="container py-10 grid lg:grid-cols-[16rem,1fr] gap-8">
      <app-admin-sidebar></app-admin-sidebar>
      <div class="space-y-6">
        <h1 class="text-2xl font-extrabold text-gray-900">
          {{ T("admin.order_management") }}
        </h1>
        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div *ngIf="orders().length === 0" class="text-gray-600">
            {{ T("admin.no_orders_yet") }}
          </div>
          <table *ngIf="orders().length > 0" class="w-full">
            <thead>
              <tr class="border-b">
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}">{{ T("admin.customer") }}</th>
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}">{{ T("admin.date") }}</th>
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}">{{ T("admin.total") }}</th>
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}">{{ T("admin.status") }}</th>
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders()" class="border-b">
                <td class="p-3">{{ order.customerName }}</td>
                <td class="p-3">{{ order.date | date: "short" }}</td>
                <td class="p-3">{{ getOrderTotal(order.totals) }}</td>
                <td class="p-3">
                  <span
                    class="font-medium"
                    [class.text-amber-600]="order.status === 'Pending'"
                    [class.text-blue-600]="order.status === 'Processing'"
                    [class.text-green-600]="order.status === 'Delivered'"
                    >{{ order.status }}</span
                  >
                </td>
                <td class="p-3">
                  <select (change)="updateStatus(order, $event)" class="select">
                    <option [selected]="order.status === 'Pending'">
                      Pending
                    </option>
                    <option [selected]="order.status === 'Processing'">
                      Processing
                    </option>
                    <option [selected]="order.status === 'Shipped'">
                      Shipped
                    </option>
                    <option [selected]="order.status === 'Delivered'">
                      Delivered
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminOrdersPage {
  private orderService = inject(OrderService);
  private i18n = inject(I18nService);
  T = this.i18n.t;
  lang = this.i18n.lang;
  orders = this.orderService.list;

  getOrderTotal(totals?: { [key: string]: number }): string {
    const t = totals ?? {};
    return Object.entries(t as Record<string, number>)
      .map(([currency, value]) => `${value.toFixed(2)} ${currency}`)
      .join(", ");
  }

  updateStatus(order: Order, event: Event) {
    const status = (event.target as HTMLSelectElement).value as Order["status"];
    const updatedOrder = { ...order, status };
    this.orderService.updateOrder(updatedOrder);
  }
}
