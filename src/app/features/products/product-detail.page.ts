import { Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductGalleryComponent } from '../../shared/components/product-gallery/product-gallery.component';
import { CartService } from '../../core/services/cart.service';
import { I18nService } from '../../core/services/i18n.service';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { ReviewFormComponent } from '../../shared/components/review-form/review-form.component';
import {
  ProductVariant,
  ProductAddon,
} from '../../shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ProductGalleryComponent,
    StarRatingComponent,
    ReviewFormComponent,
  ],
  template: `
    <div class="container py-10" *ngIf="p()">
      <div class="grid lg:grid-cols-2 gap-8">
        <app-product-gallery [images]="p()!.images"></app-product-gallery>
        <div class="space-y-4">
          <h1 class="text-3xl font-extrabold text-gray-900">
            {{ lang() === 'ar' ? p()!.nameAr : p()!.nameEn }}
          </h1>
          <div class="flex items-center gap-2" *ngIf="reviewCount() > 0">
            <app-star-rating [rating]="averageRating()"></app-star-rating>
            <span class="text-sm text-gray-500"
              >({{ reviewCount() }} {{ T('product.reviews_count') }})</span
            >
          </div>

          <!-- Variant Selection -->
          <div class="space-y-2" *ngIf="p()!.variants.length > 1">
            <h3 class="text-lg font-semibold">
              {{ T('product.options') }}
            </h3>
            <div
              *ngFor="let variant of p()!.variants"
              class="flex items-center"
            >
              <input
                type="radio"
                name="variant"
                [id]="variant.id"
                [value]="variant"
                (change)="onVariantChange(variant)"
                [checked]="variant.id === selectedVariant()?.id"
                class="radio radio-primary"
              />
              <label [for]="variant.id" class="ml-2">
                {{ lang() === 'ar' ? variant.nameAr : variant.nameEn }}
                <span class="text-sm font-bold">
                  (+{{
                    variant.price
                      | currency: p()!.currency : 'symbol-narrow' : '1.0-0'
                  }})</span
                >
              </label>
            </div>
          </div>

          <!-- Addon Selection -->
          <div class="space-y-2" *ngIf="p()!.addons?.length">
            <h3 class="text-lg font-semibold">
              {{ T('product.addons') }}
            </h3>
            <div *ngFor="let addon of p()!.addons" class="flex items-center">
              <input
                type="checkbox"
                [id]="addon.id"
                (change)="onAddonChange(addon, $event)"
                class="checkbox checkbox-primary"
              />
              <label [for]="addon.id" class="ml-2">
                {{ lang() === 'ar' ? addon.nameAr : addon.nameEn }}
                <span class="text-sm font-bold">
                  (+{{
                    addon.price
                      | currency: p()!.currency : 'symbol-narrow' : '1.0-0'
                  }})</span
                >
              </label>
            </div>
          </div>

          <div class="text-2xl text-brand-dark font-extrabold">
            {{
              totalPrice() | currency: p()!.currency : 'symbol-narrow' : '1.0-0'
            }}
          </div>
          <p class="text-gray-600">
            {{ lang() === 'ar' ? p()!.descriptionAr : p()!.descriptionEn }}
          </p>
          <div class="flex gap-2">
            <span *ngFor="let m of p()!.materials" class="chip">{{ m }}</span>
          </div>
          <button
            class="btn btn-primary"
            (click)="add()"
            [disabled]="!selectedVariant()"
          >
            {{ T('product.add_to_cart') }}
          </button>
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-extrabold text-gray-900 mb-6">
          {{ T('product.reviews') }}
        </h2>
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div *ngIf="p()!.reviews.length === 0" class="text-gray-600">
              {{ T('product.no_reviews') }}
            </div>
            <div
              *ngFor="let review of p()!.reviews"
              class="p-4 bg-white rounded-lg shadow-sm ring-1 ring-black/5"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="font-bold">
                  {{ lang() === 'ar' ? review.author : review.authorEn }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ review.date | date: 'mediumDate' }}
                </div>
              </div>
              <app-star-rating [rating]="review.rating"></app-star-rating>
              <p class="mt-2 text-gray-700">
                {{ lang() === 'ar' ? review.comment : review.commentEn }}
              </p>
            </div>
          </div>
          <div>
            <app-review-form
              (submitReview)="handleReviewSubmit($event)"
            ></app-review-form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductDetailPage {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private i18n = inject(I18nService);
  lang = this.i18n.lang;
  T = this.i18n.t;

  p = computed(() =>
    this.productService
      .products()
      .find((p) => p.id === this.route.snapshot.params['id']),
  );

  selectedVariant = signal<ProductVariant | undefined>(undefined);
  selectedAddons = signal<ProductAddon[]>([]);

  constructor() {
    effect(() => {
      const product = this.p();
      if (product && product.variants.length > 0) {
        // Set default variant if none is selected or if the selected one is not from the current product
        if (
          !this.selectedVariant() ||
          !product.variants.some((v) => v.id === this.selectedVariant()?.id)
        ) {
          this.selectedVariant.set(product.variants[0]);
        }
      }
    });
  }

  totalPrice = computed(() => {
    const variantPrice = this.selectedVariant()?.price ?? 0;
    const addonsPrice = this.selectedAddons().reduce(
      (sum, addon) => sum + addon.price,
      0,
    );
    return variantPrice + addonsPrice;
  });

  reviewCount = computed(() => this.p()?.reviews.length ?? 0);
  averageRating = computed(() => {
    if (!this.p() || this.reviewCount() === 0) return 0;
    const total = this.p()!.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    return total / this.reviewCount();
  });

  onVariantChange(variant: ProductVariant) {
    this.selectedVariant.set(variant);
  }

  onAddonChange(addon: ProductAddon, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedAddons.update((addons) => [...addons, addon]);
    } else {
      this.selectedAddons.update((addons) =>
        addons.filter((a) => a.id !== addon.id),
      );
    }
  }

  add() {
    const product = this.p();
    const variant = this.selectedVariant();
    if (!product || !variant) return;

    const addons = this.selectedAddons();
    const addonIds = addons
      .map((a) => a.id)
      .sort()
      .join('-');

    this.cart.add({
      id: `${product.id}-${variant.id}${addonIds ? '-' + addonIds : ''}`,
      productId: product.id,
      name: `${this.lang() === 'ar' ? product.nameAr : product.nameEn} - ${
        this.lang() === 'ar' ? variant.nameAr : variant.nameEn
      }`,
      price: this.totalPrice(),
      currency: product.currency,
      qty: 1,
      image: product.images[0],
      variant: variant,
      addons: addons,
    });
  }

  handleReviewSubmit(reviewData: {
    rating: number;
    comment: string;
    author: string;
    authorEn: string;
    commentEn: string;
  }) {
    if (this.p()) {
      this.productService.addReview(this.p()!.id, reviewData);
    }
  }
}
