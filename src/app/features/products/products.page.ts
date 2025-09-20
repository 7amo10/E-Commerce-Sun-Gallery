import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { CartService } from '../../core/services/cart.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    RouterLink,
    PaginationComponent,
  ],
  template: `
    <section *ngIf="showHero()" class="relative overflow-hidden">
      <div class="absolute inset-0 opacity-50 pointer-events-none"></div>
      <div class="container py-10 md:py-14 relative">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 chip bg-brand-cream/70">
              🧶 {{ T('hero.premium_handmade_products') }}
            </div>
            <h1
              class="text-3xl md:text-5xl font-extrabold leading-[1.2] text-gray-900"
            >
              {{ T('hero.welcome') }}
            </h1>
            <p class="text-gray-600">
              {{ T('hero.discover_our_collection') }}
            </p>
            <div class="flex items-center gap-3">
              <a routerLink="/products" class="btn btn-primary">{{
                T('hero.shop_now')
              }}</a>
              <a routerLink="/cart" class="btn btn-accent">{{
                T('hero.shopping_cart')
              }}</a>
            </div>
            <div class="flex flex-wrap gap-2 pt-2">
              <span *ngFor="let c of categories" class="chip">{{
                lang() === 'ar' ? c.ar : c.en
              }}</span>
            </div>
          </div>
          <div class="relative">
            <div
              class="aspect-[4/3] rounded-3xl ring-1 ring-black/5 shadow-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
                alt="handmade"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="absolute -bottom-6 -start-6 bg-white rounded-2xl p-4 shadow ring-1 ring-black/5 hidden md:block"
            >
              <div class="text-xs text-gray-500">
                {{ T('hero.guaranteed_quality') }}
              </div>
              <div class="text-lg font-extrabold text-brand-dark">
                100% Handmade
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-8 space-y-6" *ngIf="showHero()">
      <h2 class="text-2xl font-extrabold text-gray-900">
        {{ T('products.featured_products') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-product-card
          *ngFor="let p of featuredPaged()"
          [id]="p.id"
          [image]="p.images[0]"
          [title]="lang() === 'ar' ? p.nameAr : p.nameEn"
          [subtitle]="lang() === 'ar' ? p.descriptionAr : p.descriptionEn"
          [price]="p.variants[0]?.price || 0"
          [currency]="p.currency"
          [reviews]="p.reviews"
          (add)="addToCart(p)"
        ></app-product-card>
      </div>
      <app-pagination
        [totalItems]="featuredProducts().length"
        [pageSize]="pageSize"
        [currentPage]="pageFeatured()"
        (pageChange)="pageFeatured.set($event)"
      ></app-pagination>
    </section>

    <section class="container py-8 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-extrabold text-gray-900">
          {{ T('products.all_products') }}
        </h2>
        <div class="flex items-center gap-2">
          <button
            class="chip"
            [ngClass]="{ 'bg-brand-pink/20': selected() === 'all' }"
            (click)="select('all')"
          >
            {{ T('products.all') }}
          </button>
          <button
            class="chip"
            *ngFor="let c of categories"
            [ngClass]="{ 'bg-brand-pink/20': selected() === c.key }"
            (click)="select(c.key)"
          >
            {{ lang() === 'ar' ? c.ar : c.en }}
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-product-card
          *ngFor="let p of allPaged()"
          [id]="p.id"
          [image]="p.images[0]"
          [title]="lang() === 'ar' ? p.nameAr : p.nameEn"
          [subtitle]="lang() === 'ar' ? p.descriptionAr : p.descriptionEn"
          [price]="p.variants[0]?.price || 0"
          [currency]="p.currency"
          [reviews]="p.reviews"
          (add)="addToCart(p)"
        ></app-product-card>
      </div>
      <app-pagination
        [totalItems]="filtered().length"
        [pageSize]="pageSize"
        [currentPage]="pageAll()"
        (pageChange)="pageAll.set($event)"
      ></app-pagination>
    </section>
  `,
})
export class ProductsPage {
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private i18n = inject(I18nService);
  private activatedRoute = inject(ActivatedRoute);

  lang = this.i18n.lang;
  T = this.i18n.t;
  categories = this.productService.categories();
  selected = signal<
    'all' | ReturnType<ProductService['categories']>[number]['key']
  >('all');

  readonly showHero = toSignal(
    this.activatedRoute.url.pipe(map((segments) => segments.length === 0)),
    { initialValue: this.activatedRoute.snapshot.url.length === 0 },
  );

  products = this.productService.products;
  featuredProducts = computed(() => this.products().filter((p) => p.featured));
  filtered = computed(() => {
    const sel = this.selected();
    return this.products().filter((p) =>
      sel === 'all' ? true : p.category === sel,
    );
  });

  // pagination states
  pageSize = 6;
  pageAll = signal(1);
  pageFeatured = signal(1);

  private paginate<T>(arr: T[], page: number, size: number): T[] {
    const start = (page - 1) * size;
    return arr.slice(start, start + size);
  }

  featuredPaged = computed(() =>
    this.paginate(this.featuredProducts(), this.pageFeatured(), this.pageSize),
  );
  allPaged = computed(() =>
    this.paginate(this.filtered(), this.pageAll(), this.pageSize),
  );

  select(cat: 'all' | any) {
    this.selected.set(cat);
    this.pageAll.set(1);
  }
  addToCart(p: Product) {
    const defaultVariant = p.variants[0];
    if (!defaultVariant) return;

    this.cart.add({
      id: `${p.id}-${defaultVariant.id}`,
      productId: p.id,
      name: `${this.lang() === 'ar' ? p.nameAr : p.nameEn} - ${
        this.lang() === 'ar' ? defaultVariant.nameAr : defaultVariant.nameEn
      }`,
      price: defaultVariant.price,
      currency: p.currency,
      qty: 1,
      image: p.images[0],
      variant: defaultVariant,
    });
  }
}
