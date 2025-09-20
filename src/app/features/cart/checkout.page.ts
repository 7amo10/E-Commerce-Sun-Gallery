import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OrderSummaryComponent],
  template: `
    <div class="container py-10 grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <h1 class="text-2xl font-extrabold text-gray-900">{{ T('checkout.checkout') }}</h1>
        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          class="space-y-4 p-6 bg-white rounded-2xl shadow-sm ring-1 ring-black/5"
        >
          <div class="form-control">
            <label>{{ T('checkout.full_name') }}</label>
            <input type="text" formControlName="customerName" />
          </div>
          <div class="form-control">
            <label>{{ T('checkout.shipping_address') }}</label>
            <input type="text" formControlName="address" />
          </div>
          <div class="form-control">
            <label>{{ T('checkout.phone_number') }}</label>
            <input type="tel" formControlName="phone" />
          </div>
        </form>
      </div>
      <div class="space-y-4">
        <app-order-summary [totals]="totals()"></app-order-summary>
        <div *ngIf="hasMultipleCurrencies()" class="text-red-600 text-sm">
          {{ T('checkout.multiple_currencies_error') }}
        </div>
        <button
          class="btn btn-accent w-full"
          (click)="submit()"
          [disabled]="form.invalid || hasMultipleCurrencies()"
        >
          {{ T('checkout.place_order') }}
        </button>
      </div>
    </div>
  `,
})
export class CheckoutPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private i18n = inject(I18nService);
  T = this.i18n.t;

  form = this.fb.group({
    customerName: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
  });

  totals = this.cart.totalsByCurrency;
  currencies = computed(() => Object.keys(this.totals()));
  hasMultipleCurrencies = computed(() => this.currencies().length > 1);

  get singleCurrencyTotal(): number {
    if (this.hasMultipleCurrencies() || this.currencies().length === 0)
      return 0;
    const currency = this.currencies()[0];
    const summary = this.totals()[currency];
    // This is a simplification. In a real app, shipping should be handled more robustly.
    const shipping = 20;
    return summary + shipping;
  }

  submit() {
    if (this.form.invalid || this.hasMultipleCurrencies()) return;
    const { customerName, address, phone } = this.form.getRawValue();
    const newOrder = this.orderService.placeOrder(
      customerName!,
      address!,
      phone!,
      this.cart.list(),
      this.totals(),
    );
    this.cart.clear();
    this.router.navigate(['/orders', newOrder.id]);
  }
}
