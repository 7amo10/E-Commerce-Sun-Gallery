import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 class="text-lg font-extrabold text-gray-900 mb-4">
        {{ T('order_summary.order_summary') }}
      </h3>
      <div
        *ngFor="let currency of objectKeys(totals)"
        class="space-y-2 text-sm text-gray-700 mb-4"
      >
        <div class="flex items-center justify-between">
          <span
            >{{ T('order_summary.subtotal') }} ({{ currency }})</span
          >
          <span
            >{{
              totals[currency]
                | currency: currency: 'symbol-narrow': '1.0-0'
            }}</span
          >
        </div>
        <div class="flex items-center justify-between">
          <span>{{ T('order_summary.shipping') }}</span>
          <span
            >{{
              shipping | currency: currency: 'symbol-narrow': '1.0-0'
            }}</span
          >
        </div>
        <div class="flex items-center justify-between">
          <span>{{ T('order_summary.tax') }}</span>
          <span
            >{{ tax | currency: currency: 'symbol-narrow': '1.0-0' }}</span
          >
        </div>
        <div class="border-t border-dashed my-3"></div>
        <div
          class="flex items-center justify-between text-brand-dark font-extrabold"
        >
          <span>{{ T('order_summary.total') }} ({{ currency }})</span>
          <span
            >{{
              totals[currency] + shipping + tax
                | currency: currency: 'symbol-narrow': '1.0-0'
            }}</span
          >
        </div>
      </div>
      <ng-content></ng-content>
    </div>
  `,
})
export class OrderSummaryComponent {
  @Input() totals: { [key: string]: number } = {};
  @Input() shipping = 20; // NOTE: Assuming this is applied per currency order.
  @Input() tax = 0;
  private i18n = inject(I18nService);
  T = this.i18n.t;

  objectKeys = Object.keys;
}
