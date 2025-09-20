import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg viewBox="0 0 100 40" class="w-full h-24">
      <polyline [attr.points]="points" fill="none" stroke="#D4A574" stroke-width="2"/>
    </svg>
  `
})
export class ChartComponent {
  @Input() data: number[] = [5, 8, 6, 10, 7, 12, 9];
  get points() {
    const max = Math.max(...this.data, 1); const step = 100 / (this.data.length - 1 || 1);
    return this.data.map((v, i) => `${i * step},${40 - (v / max) * 35 - 2}`).join(' ');
  }
}
