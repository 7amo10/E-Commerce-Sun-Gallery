import {
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { BRAND_LOGO_EXTERNAL } from '../../../config/app.config';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-50 transition-all duration-300"
      [ngClass]="{
        'shadow-md border-b border-black/5 bg-white/80 backdrop-blur-lg':
          scrolled() || menuOpen(),
      }"
    >
      <div class="container flex items-center justify-between py-3">
        <div class="flex items-center gap-4">
          <a routerLink="/" class="flex items-center gap-3">
            <img
              [src]="logoUrl()"
              (error)="onLogoError()"
              alt="{{ T('brand.name') }}"
              class="h-12 w-12 rounded-full object-cover ring-1 ring-black/5"
            />
            <div class="leading-tight">
              <div class="text-base font-extrabold text-brand-dark">
                {{ T('brand.name') }}
              </div>
              <div class="text-xs text-gray-600">{{ T('brand.subtitle') }}</div>
            </div>
          </a>
        </div>

        <!-- desktop nav -->
        <nav
          class="hidden md:flex items-center gap-6 text-sm text-brand-dark"
          role="navigation"
          aria-label="main navigation"
        >
          <ul class="flex items-center gap-2">
            <li>
              <a
                routerLink="/"
                routerLinkActive="text-brand-primary"
                [routerLinkActiveOptions]="{ exact: true }"
                [attr.title]="T('nav.home')"
                [attr.aria-label]="T('nav.home')"
                class="px-3 py-2 rounded-md hover:bg-white/60"
                >{{ T('nav.home') }}</a
              >
            </li>
            <li>
              <a
                routerLink="/products"
                routerLinkActive="text-brand-primary"
                [attr.title]="T('nav.products')"
                [attr.aria-label]="T('nav.products')"
                class="px-3 py-2 rounded-md hover:bg-white/60"
                >{{ T('nav.products') }}</a
              >
            </li>
            <li>
              <a
                routerLink="/orders"
                routerLinkActive="text-brand-primary"
                [attr.title]="T('nav.orders')"
                [attr.aria-label]="T('nav.orders')"
                class="px-3 py-2 rounded-md hover:bg-white/60"
                >{{ T('nav.orders') }}</a
              >
            </li>
            <li *ngIf="isAdmin()">
              <a
                routerLink="/admin"
                routerLinkActive="text-brand-primary"
                [attr.title]="T('nav.admin')"
                [attr.aria-label]="T('nav.admin')"
                class="px-3 py-2 rounded-md hover:bg-white/60"
                >{{ T('nav.admin') }}</a
              >
            </li>
          </ul>
        </nav>

        <!-- mobile controls -->
        <div class="flex items-center gap-3">
          <button class="md:hidden btn" (click)="menuOpen.set(!menuOpen())">
            ☰
          </button>
          <button
            class="btn btn-primary hidden md:inline-block"
            (click)="toggleLang()"
          >
            {{ lang() === 'ar' ? 'EN' : 'ع' }}
          </button>
          <a
            routerLink="/cart"
            class="relative inline-flex items-center justify-center h-10 w-10 rounded-md bg-white ring-1 ring-black/10 hover:ring-black/20"
          >
            <span class="text-lg">🧺</span>
            <span
              *ngIf="count() > 0"
              class="absolute -top-2 -right-2 text-[11px] bg-brand-pink text-white rounded-full px-2 py-0.5"
              >{{ count() }}</span
            >
          </a>

          <ng-container *ngIf="!user()" class="hidden md:block">
            <a routerLink="/auth/login" class="btn btn-accent">دخول / تسجيل</a>
          </ng-container>

          <ng-container *ngIf="user()" class="hidden md:block">
            <div
              class="flex items-center gap-2 bg-white rounded-md px-3 py-1 ring-1 ring-black/5"
            >
              <div class="text-sm font-medium">{{ user()?.name }}</div>
              <button class="btn" (click)="logout()">خروج</button>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- mobile nav drawer -->
      <div
        *ngIf="menuOpen()"
        class="md:hidden bg-white/90 border-t border-black/5 w-full"
      >
        <div class="container py-4">
          <ul class="flex flex-col gap-2">
            <li>
              <a
                routerLink="/"
                (click)="menuOpen.set(false)"
                class="block px-3 py-2 rounded-md"
                >{{ T('nav.home') }}</a
              >
            </li>
            <li>
              <a
                routerLink="/products"
                (click)="menuOpen.set(false)"
                class="block px-3 py-2 rounded-md"
                >{{ T('nav.products') }}</a
              >
            </li>
            <li>
              <a
                routerLink="/orders"
                (click)="menuOpen.set(false)"
                class="block px-3 py-2 rounded-md"
                >{{ T('nav.orders') }}</a
              >
            </li>
            <li *ngIf="isAdmin()">
              <a
                routerLink="/admin"
                (click)="menuOpen.set(false)"
                class="block px-3 py-2 rounded-md"
                >{{ T('nav.admin') }}</a
              >
            </li>
          </ul>
          <div class="pt-4">
            <a
              *ngIf="!user()"
              routerLink="/auth/login"
              (click)="menuOpen.set(false)"
              class="btn btn-accent w-full"
              >دخول / تسجيل</a
            >
            <div *ngIf="user()" class="flex items-center gap-2">
              <div class="flex-1">{{ user()?.name }}</div>
              <button class="btn" (click)="logout()">خروج</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private i18n = inject(I18nService);
  private cart = inject(CartService);
  private auth = inject(AuthService);
  lang = this.i18n.lang;
  count = this.cart.count;
  T = this.i18n.t;
  user = this.auth.user;

  menuOpen = signal(false);
  scrolled = signal(false);
  logoUrl = signal('/assets/handmade-logo.webp');

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled.set(window.scrollY > 10);
  }

  onLogoError() {
    this.logoUrl.set(BRAND_LOGO_EXTERNAL);
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

  logout() {
    this.auth.logout();
  }

  toggleLang() {
    this.i18n.switch(this.lang() === 'ar' ? 'en' : 'ar');
  }
}
