import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminSidebarComponent } from "../../shared/components/admin-sidebar/admin-sidebar.component";
import { AdminService } from "../../core/services/admin.service";
import { ChartComponent } from "../../shared/components/chart/chart.component";
import { I18nService } from "../../core/services/i18n.service";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, ChartComponent],
  template: `
    <div class="container py-10 grid lg:grid-cols-[16rem,1fr] gap-8">
      <app-admin-sidebar></app-admin-sidebar>
      <div class="space-y-6">
        <h1 class="text-2xl font-extrabold text-gray-900">
          {{ T("admin.dashboard") }}
        </h1>
        <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div class="text-sm text-gray-500">
              {{ T("admin.total_sales") }}
            </div>
            <div class="text-2xl font-extrabold">{{ totalSales() }}</div>
          </div>
          <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div class="text-sm text-gray-500">
              {{ T("admin.total_orders") }}
            </div>
            <div class="text-2xl font-extrabold">{{ totalOrders() }}</div>
          </div>
          <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div class="text-sm text-gray-500">
              {{ T("admin.total_stock") }}
            </div>
            <div class="text-2xl font-extrabold">{{ totalStock() }}</div>
          </div>
          <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div class="text-sm text-gray-500">
              {{ T("admin.out_of_stock_products") }}
            </div>
            <div class="text-2xl font-extrabold">
              {{ outOfStockProducts() }}
            </div>
          </div>
        </div>
        <div class="grid xl:grid-cols-2 gap-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              {{ T("admin.latest_orders") }}
            </h2>
            <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div *ngIf="latestOrders().length === 0" class="text-gray-600">
                {{ T("admin.no_orders_yet") }}
              </div>
              <ul *ngIf="latestOrders().length > 0" class="divide-y">
                <li *ngFor="let order of latestOrders()" class="py-3">
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-bold">{{ order.customerName }}</div>
                      <div class="text-sm text-gray-600">
                        {{ getOrderTotal(order.totals) }} -
                        {{ order.date | date: "short" }}
                      </div>
                    </div>
                    <div
                      class="text-sm font-medium"
                      [class.text-amber-600]="order.status === 'Pending'"
                      [class.text-blue-600]="order.status === 'Processing'"
                      [class.text-green-600]="order.status === 'Delivered'"
                    >
                      {{ order.status }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              {{ T("admin.sales_last_7_days") }}
            </h2>
            <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <app-mini-chart [data]="salesByDay()"></app-mini-chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardPage {
  private adminService = inject(AdminService);
  private i18n = inject(I18nService);
  T = this.i18n.t;
  totalSales = this.adminService.totalSales;
  totalOrders = this.adminService.totalOrders;
  latestOrders = this.adminService.latestOrders;
  totalStock = this.adminService.totalStock;
  outOfStockProducts = this.adminService.outOfStockProducts;
  salesByDay = this.adminService.salesByDay;

  getOrderTotal(totals?: { [key: string]: number }): string {
    const t = totals ?? {};
    return Object.entries(t as Record<string, number>)
      .map(([currency, value]) => `${value.toFixed(2)} ${currency}`)
      .join(", ");
  }
}
