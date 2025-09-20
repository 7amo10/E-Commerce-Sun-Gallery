import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderSummaryComponent],
  template: `
    <div class="container py-10 grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <h1 class="text-2xl font-extrabold text-gray-900">{{ T('cart.shopping_cart') }}</h1>
        <div *ngIf="items().length === 0" class="text-gray-600">{{ T('cart.your_cart_is_empty') }}</div>
        <div *ngFor="let i of items()" class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm ring-1 ring-black/5">
          <img [src]="i.image" class="h-20 w-20 object-cover rounded-xl"/>
          <div class="flex-1">
            <div class="font-bold">{{ i.name }}</div>
            <div class="text-sm text-gray-600">
              {{ i.price | currency: i.currency: 'symbol-narrow': '1.0-0' }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="chip" (click)="dec(i.id, i.qty)">−</button>
            <div class="w-10 text-center">{{ i.qty }}</div>
            <button class="chip" (click)="inc(i.id, i.qty)">+</button>
          </div>
          <button class="text-red-600 hover:underline" (click)="remove(i.id)">{{ T('cart.remove') }}</button>
        </div>
      </div>
      <div class="space-y-4">
        <app-order-summary [totals]="totals()"></app-order-summary>
        <a routerLink="/checkout" class="btn btn-accent w-full">{{ T('cart.checkout_as_guest') }}</a>
      </div>
    </div>
  `
})
export class CartPage {
  private cart = inject(CartService);
  private i18n = inject(I18nService);
  T = this.i18n.t;
  items = this.cart.list;
  totals = this.cart.totalsByCurrency;

  inc(id: string, qty: number) { this.cart.updateQty(id, qty + 1); }
  dec(id: string, qty: number) { this.cart.updateQty(id, qty - 1); }
  remove(id: string) { this.cart.remove(id); }
}
