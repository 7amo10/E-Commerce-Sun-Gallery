import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center"
      [class.cursor-pointer]="interactive"
      (mouseleave)="onMouseLeave()"
    >
      <ng-container *ngFor="let i of [1, 2, 3, 4, 5]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          [attr.fill]="getFillColor(i)"
          (mouseenter)="onMouseEnter(i)"
          (click)="onClick(i)"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </ng-container>
    </div>
  `,
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() interactive: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoveredRating = signal(0);

  getFillColor(starIndex: number): string {
    const displayRating =
      this.hoveredRating() > 0 ? this.hoveredRating() : this.rating;
    return starIndex <= displayRating ? '#FFD700' : '#E5E7EB';
  }

  onMouseEnter(starIndex: number) {
    if (this.interactive) {
      this.hoveredRating.set(starIndex);
    }
  }

  onMouseLeave() {
    if (this.interactive) {
      this.hoveredRating.set(0);
    }
  }

  onClick(starIndex: number) {
    if (this.interactive) {
      this.rating = starIndex;
      this.ratingChange.emit(this.rating);
    }
  }
}
