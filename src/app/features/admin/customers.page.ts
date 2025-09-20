import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../shared/components/admin-sidebar/admin-sidebar.component';
import { CustomerService } from '../../core/services/customer.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-admin-customers-page',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  template: `
    <div class="container py-10 grid lg:grid-cols-[16rem,1fr] gap-8">
      <app-admin-sidebar></app-admin-sidebar>
      <div class="space-y-6">
        <h1 class="text-2xl font-extrabold text-gray-900">{{ T('admin.customers') }}</h1>
        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div *ngIf="customers().length === 0" class="text-gray-600">{{ T('admin.no_customers_yet') }}</div>
          <table *ngIf="customers().length > 0" class="w-full">
            <thead>
              <tr class="border-b">
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}">{{ T('admin.name') }}</th>
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}">{{ T('admin.phone') }}</th>
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}">{{ T('admin.order_count') }}</th>
                <th class="p-3" [ngClass]="{'text-right': lang() === 'ar', 'text-left': lang() === 'en'}">{{ T('admin.total_payments') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let customer of customers()" class="border-b">
                <td class="p-3">{{ customer.name }}</td>
                <td class="p-3">{{ customer.phone }}</td>
                <td class="p-3">{{ customer.orderCount }}</td>
                <td class="p-3">{{ customer.totalSpent | currency:'AED':'symbol-narrow':'1.0-0' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminCustomersPage {
  private customerService = inject(CustomerService);
  private i18n = inject(I18nService);
  T = this.i18n.t;
  lang = this.i18n.lang;
  customers = this.customerService.customers;
}
