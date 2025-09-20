import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="w-full md:w-64 bg-white rounded-2xl p-4 shadow-sm ring-1 ring-black/5">
      <nav class="space-y-2 text-sm">
        <a routerLink="/admin" class="block px-3 py-2 rounded-lg hover:bg-brand-cream/60">{{ T('admin.dashboard') }}</a>
        <a routerLink="/admin/products" class="block px-3 py-2 rounded-lg hover:bg-brand-cream/60">{{ T('admin.product_management') }}</a>
        <a routerLink="/admin/orders" class="block px-3 py-2 rounded-lg hover:bg-brand-cream/60">{{ T('admin.order_management') }}</a>
        <a routerLink="/admin/customers" class="block px-3 py-2 rounded-lg hover:bg-brand-cream/60">{{ T('admin.customers') }}</a>
      </nav>
    </aside>
  `
})
export class AdminSidebarComponent {
  private i18n = inject(I18nService);
  T = this.i18n.t;
}
