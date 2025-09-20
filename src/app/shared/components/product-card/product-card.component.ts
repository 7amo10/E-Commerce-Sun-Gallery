import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Review } from '../../../shared/models/product.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent],
  template: `
    <div
      class="group rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden hover:shadow-md transition-shadow"
    >
      <a [routerLink]="['/products', id]" class="block overflow-hidden">
        <img
          [src]="image"
          [alt]="title"
          class="h-56 w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
      </a>
      <div class="p-4 space-y-2">
        <h3 class="text-base font-bold text-gray-900 line-clamp-1">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500 line-clamp-2">{{ subtitle }}</p>
        <div class="flex items-center gap-2" *ngIf="reviewCount() > 0">
          <app-star-rating [rating]="averageRating()"></app-star-rating>
          <span class="text-xs text-gray-500">({{ reviewCount() }})</span>
        </div>
        <div class="flex items-center justify-between pt-2">
          <span class="text-brand-dark font-extrabold">{{
            price | currency: currency: 'symbol-narrow': '1.0-0'
          }}</span>
          <button class="btn btn-primary" (click)="add.emit()">
            إضافة للسلة
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input() id!: string;
  @Input() image!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() price!: number;
  @Input() currency: 'AED' | 'LE' = 'AED';
  @Input() reviews: Review[] = [];
  @Output() add = new EventEmitter<void>();

  reviewCount = computed(() => this.reviews.length);
  averageRating = computed(() => {
    if (this.reviewCount() === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviewCount();
  });
}
