import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-4 gap-3">
      <div class="col-span-4 md:col-span-3">
        <img [src]="images[selected]" alt="image" class="w-full h-96 object-cover rounded-xl ring-1 ring-black/5"/>
      </div>
      <div class="col-span-4 md:col-span-1 flex md:flex-col gap-3 overflow-auto">
        <img *ngFor="let img of images; index as i" [src]="img" (click)="selected = i" [class.ring-brand-primary]="selected===i"
          class="h-24 w-24 object-cover rounded-lg ring-2 ring-transparent cursor-pointer hover:opacity-90" />
      </div>
    </div>
  `
})
export class ProductGalleryComponent {
  @Input() images: string[] = [];
  selected = 0;
}
