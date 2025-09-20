import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../shared/components/admin-sidebar/admin-sidebar.component';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/models/product.model';
import { ProductFormComponent } from '../../shared/components/product-form/product-form.component';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, ProductFormComponent],
  template: `
    <div class="container py-10 grid lg:grid-cols-[16rem,1fr] gap-8">
      <app-admin-sidebar></app-admin-sidebar>
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-extrabold text-gray-900">
            {{ T('admin.product_management') }}
          </h1>
          <button class="btn btn-primary" (click)="showForm.set(true)">
            {{ T('admin.add_product') }}
          </button>
        </div>

        <div
          *ngIf="showForm()"
          class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          (click)="hideForm()"
        >
          <div
            class="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
            (click)="$event.stopPropagation()"
          >
            <div class="p-6 border-b">
              <h2 class="text-xl font-bold">
                {{
                  selectedProduct()
                    ? T('admin.edit_product')
                    : T('admin.add_new_product')
                }}
              </h2>
            </div>
            <app-product-form
              [product]="selectedProduct()"
              (save)="handleSave($event)"
              (cancel)="hideForm()"
            ></app-product-form>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div *ngIf="products().length === 0" class="text-gray-600">
            {{ T('admin.no_products_yet') }}
          </div>
          <table *ngIf="products().length > 0" class="w-full">
            <thead>
              <tr class="border-b">
                <th
                  class="p-3"
                  [ngClass]="{
                    'text-right': lang() === 'ar',
                    'text-left': lang() === 'en',
                  }"
                >
                  {{ T('admin.product') }}
                </th>
                <th
                  class="p-3"
                  [ngClass]="{
                    'text-right': lang() === 'ar',
                    'text-left': lang() === 'en',
                  }"
                >
                  {{ T('admin.price') }}
                </th>
                <th
                  class="p-3"
                  [ngClass]="{
                    'text-right': lang() === 'ar',
                    'text-left': lang() === 'en',
                  }"
                >
                  {{ T('admin.stock') }}
                </th>
                <th
                  class="p-3"
                  [ngClass]="{
                    'text-right': lang() === 'ar',
                    'text-left': lang() === 'en',
                  }"
                ></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of products()" class="border-b">
                <td class="p-3">
                  {{ lang() === 'ar' ? product.nameAr : product.nameEn }}
                </td>
                <td class="p-3">
                  {{
                    product.variants[0]?.price
                      | currency: product.currency : 'symbol-narrow' : '1.0-0'
                  }}
                  <span *ngIf="product.variants.length > 1">...</span>
                </td>
                <td class="p-3">{{ getTotalStock(product) }}</td>
                <td class="p-3 space-x-2">
                  <button
                    class="btn btn-sm btn-accent"
                    (click)="editProduct(product)"
                  >
                    {{ T('admin.edit') }}
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    (click)="deleteProduct(product.id)"
                  >
                    {{ T('admin.delete') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminProductsManagementPage {
  private productService = inject(ProductService);
  private i18n = inject(I18nService);
  T = this.i18n.t;
  lang = this.i18n.lang;
  products = this.productService.products;
  showForm = signal(false);
  selectedProduct = signal<Product | undefined>(undefined);

  getTotalStock(product: Product): number {
    return product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  }

  editProduct(product: Product) {
    this.selectedProduct.set(product);
    this.showForm.set(true);
  }

  deleteProduct(id: string) {
    if (confirm(this.T('admin.delete_product_confirm'))) {
      this.productService.deleteProduct(id);
    }
  }

  handleSave(productData: Partial<Product>) {
    if (this.selectedProduct()) {
      this.productService.updateProduct({
        ...this.selectedProduct()!,
        ...productData,
      });
    } else {
      this.productService.addProduct(
        productData as Omit<Product, 'id' | 'createdAt'>,
      );
    }
    this.hideForm();
  }

  hideForm() {
    this.showForm.set(false);
    this.selectedProduct.set(undefined);
  }
}
