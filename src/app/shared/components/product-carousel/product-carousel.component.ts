import { Component, Input, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Product } from "../../../shared/models/product.model";
import { ProductCardComponent } from "../product-card/product-card.component";
import { I18nService } from "../../../core/services/i18n.service";
import { CartService } from "../../../core/services/cart.service";

@Component({
  selector: "app-product-carousel",
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="relative">
      <div class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
        <div class="min-w-[280px] snap-start" *ngFor="let product of products">
          <app-product-card
            [id]="product.id"
            [image]="product.images[0]"
            [title]="lang() === 'ar' ? product.nameAr : product.nameEn"
            [subtitle]="
              lang() === 'ar' ? product.descriptionAr : product.descriptionEn
            "
            [price]="product.variants?.[0]?.price || 0"
            (add)="addToCart(product)"
          ></app-product-card>
        </div>
      </div>
    </div>
  `,
})
export class ProductCarouselComponent {
  @Input() products: Product[] = [];
  private i18n = inject(I18nService);
  private cart = inject(CartService);
  lang = this.i18n.lang;

  addToCart(p: Product) {
    const v = p.variants?.[0];
    const name = this.lang() === "ar" ? p.nameAr : p.nameEn;
    const variantName = v ? (this.lang() === "ar" ? v.nameAr : v.nameEn) : "";
    this.cart.add({
      id: `${p.id}-${v?.id ?? "default"}`,
      productId: p.id,
      name: variantName ? `${name} - ${variantName}` : name,
      price: v?.price ?? 0,
      currency: p.currency,
      qty: 1,
      image: p.images[0],
      variant: v as any,
    });
  }
}
