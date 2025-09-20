import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Product,
  ProductAddon,
  ProductCategory,
  ProductVariant,
} from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="submit()"
      class="space-y-4 p-6 bg-white rounded-2xl max-h-[90vh] overflow-y-auto"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-control">
          <label>الإسم (عربي)</label>
          <input
            type="text"
            formControlName="nameAr"
            placeholder="مثال: حقيبة كروشيه"
          />
        </div>
        <div class="form-control">
          <label>الإسم (إنجليزي)</label>
          <input
            type="text"
            formControlName="nameEn"
            placeholder="e.g., Crochet Bag"
          />
        </div>
      </div>
      <div class="form-control">
        <label>الوصف (عربي)</label>
        <textarea
          formControlName="descriptionAr"
          rows="3"
          placeholder="وصف قصير للمنتج..."
        ></textarea>
      </div>
      <div class="form-control">
        <label>الوصف (إنجليزي)</label>
        <textarea
          formControlName="descriptionEn"
          rows="3"
          placeholder="A short description of the product..."
        ></textarea>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-control">
          <label>العملة</label>
          <select formControlName="currency">
            <option value="AED">AED</option>
            <option value="EGP">EGP</option>
          </select>
        </div>
        <div class="form-control">
          <label>الصنف</label>
          <select formControlName="category">
            <option value="bags">حقائب</option>
            <option value="clothing">ملابس</option>
            <option value="accessories">اكسسوارات</option>
            <option value="home">ديكورات منزلية</option>
          </select>
        </div>
      </div>

      <!-- Variants -->
      <div>
        <h3 class="text-lg font-semibold mb-2">
          الخيارات/الأحجام (Variants)
        </h3>
        <div formArrayName="variants" class="space-y-4">
          <div
            *ngFor="let variantGroup of variants.controls; let i = index"
            [formGroupName]="i"
            class="p-4 border rounded-lg relative"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-control">
                <label>اسم الخيار (عربي)</label>
                <input type="text" formControlName="nameAr" placeholder="وسط" />
              </div>
              <div class="form-control">
                <label>اسم الخيار (إنجليزي)</label>
                <input
                  type="text"
                  formControlName="nameEn"
                  placeholder="Medium"
                />
              </div>
              <div class="form-control">
                <label>السعر</label>
                <input
                  type="number"
                  formControlName="price"
                  placeholder="180"
                />
              </div>
              <div class="form-control">
                <label>المخزون</label>
                <input
                  type="number"
                  formControlName="stockQuantity"
                  placeholder="8"
                />
              </div>
            </div>
            <button
              type="button"
              (click)="removeVariant(i)"
              class="btn btn-sm btn-danger absolute top-2 right-2"
            >
              X
            </button>
          </div>
        </div>
        <button type="button" (click)="addVariant()" class="btn btn-sm mt-4">
          إضافة خيار
        </button>
      </div>

      <!-- Addons -->
      <div>
        <h3 class="text-lg font-semibold mb-2">إضافات (Add-ons)</h3>
        <div formArrayName="addons" class="space-y-4">
          <div
            *ngFor="let addonGroup of addons.controls; let i = index"
            [formGroupName]="i"
            class="p-4 border rounded-lg relative"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-control">
                <label>اسم الإضافة (عربي)</label>
                <input
                  type="text"
                  formControlName="nameAr"
                  placeholder="إضافة شراشيب"
                />
              </div>
              <div class="form-control">
                <label>اسم الإضافة (إنجليزي)</label>
                <input
                  type="text"
                  formControlName="nameEn"
                  placeholder="Add Tassels"
                />
              </div>
              <div class="form-control">
                <label>سعر الإضافة</label>
                <input
                  type="number"
                  formControlName="price"
                  placeholder="50"
                />
              </div>
            </div>
            <button
              type="button"
              (click)="removeAddon(i)"
              class="btn btn-sm btn-danger absolute top-2 right-2"
            >
              X
            </button>
          </div>
        </div>
        <button type="button" (click)="addAddon()" class="btn btn-sm mt-4">
          إضافة إضافة
        </button>
      </div>

      <div class="flex justify-end gap-4 pt-4 border-t">
        <button type="button" (click)="cancel.emit()" class="btn">إلغاء</button>
        <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
          حفظ
        </button>
      </div>
    </form>
  `,
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() product?: Product;
  @Output() save = new EventEmitter<Partial<Product>>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      currency: ['AED' as 'AED' | 'LE', Validators.required],
      category: ['bags' as ProductCategory, Validators.required],
      materials: this.fb.array([]),
      colors: this.fb.array([]),
      images: this.fb.array([]),
      featured: [false],
      variants: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      addons: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.product) {
      this.form.patchValue({
        nameAr: this.product.nameAr,
        nameEn: this.product.nameEn,
        descriptionAr: this.product.descriptionAr,
        descriptionEn: this.product.descriptionEn,
        currency: this.product.currency,
        category: this.product.category,
        featured: this.product.featured
      });

      this.product.images.forEach(i => (this.form.get('images') as FormArray).push(this.fb.control(i, Validators.required)));
      this.product.materials.forEach(m => (this.form.get('materials') as FormArray).push(this.fb.control(m, Validators.required)));
      this.product.colors.forEach(c => (this.form.get('colors') as FormArray).push(this.fb.control(c, Validators.required)));

      this.product.variants.forEach(variant => this.variants.push(this.createVariantGroup(variant)));
      this.product.addons?.forEach(addon => this.addons.push(this.createAddonGroup(addon)));
    }
  }

  get variants() {
    return this.form.get('variants') as FormArray;
  }

  addVariant() {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  createVariantGroup(variant?: ProductVariant): FormGroup {
    return this.fb.group({
      id: [variant?.id || crypto.randomUUID()],
      nameAr: [variant?.nameAr || '', Validators.required],
      nameEn: [variant?.nameEn || '', Validators.required],
      price: [variant?.price || 0, [Validators.required, Validators.min(0)]],
      stockQuantity: [
        variant?.stockQuantity || 0,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  get addons() {
    return this.form.get('addons') as FormArray;
  }

  createAddonGroup(addon?: ProductAddon): FormGroup {
    return this.fb.group({
      id: [addon?.id || crypto.randomUUID()],
      nameAr: [addon?.nameAr || '', Validators.required],
      nameEn: [addon?.nameEn || '', Validators.required],
      price: [addon?.price || 0, [Validators.required, Validators.min(0)]],
    });
  }

  addAddon() {
    this.addons.push(this.createAddonGroup());
  }

  removeAddon(index: number) {
    this.addons.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.getRawValue();
    const productData: Partial<Product> = {
      ...this.product,
      ...formValue,
    };
    this.save.emit(productData);
  }
}
