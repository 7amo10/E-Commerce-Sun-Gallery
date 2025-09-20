import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <div class="spinner"></div>
    </div>
  `,
  styles: [
    `
      .spinner {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 9px solid #d2b48c;
        border-right-color: transparent;
        animation: spinner-anim 1s infinite linear;
      }

      @keyframes spinner-anim {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoadingSpinnerComponent {}
