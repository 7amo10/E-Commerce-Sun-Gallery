import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="flex items-center justify-center gap-4 mt-10"
      aria-label="pagination"
    >
      <button
        class="btn btn-accent"
        [disabled]="page() <= 1"
        (click)="setPage(page() - 1)"
      >
        «
      </button>

      <ng-container *ngFor="let p of pages()">
        <button
          class="btn"
          [ngClass]="{
            'btn-primary': p === page(),
          }"
          (click)="setPage(p)"
        >
          {{ p }}
        </button>
      </ng-container>

      <button
        class="btn btn-accent"
        [disabled]="page() >= totalPages()"
        (click)="setPage(page() + 1)"
      >
        »
      </button>
    </nav>
  `,
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 6;
  @Input() set currentPage(v: number) {
    this.page.set(v || 1);
  }
  @Output() pageChange = new EventEmitter<number>();

  page = signal(1);
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems / this.pageSize)),
  );

  pages = computed(() => {
    const t = this.totalPages();
    const p = this.page();
    const max = 5; // show up to 5 page buttons
    const start = Math.max(1, Math.min(p - 2, t - max + 1));
    const end = Math.min(t, start + max - 1);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  });

  setPage(p: number) {
    const clamped = Math.min(Math.max(1, p), this.totalPages());
    if (clamped !== this.page()) {
      this.page.set(clamped);
      this.pageChange.emit(clamped);
    }
  }
}
