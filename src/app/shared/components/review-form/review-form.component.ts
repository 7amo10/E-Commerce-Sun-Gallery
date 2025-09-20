import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StarRatingComponent],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="submit()"
      class="space-y-4 p-6 bg-white rounded-2xl shadow-sm ring-1 ring-black/5"
    >
      <h3 class="text-lg font-bold">{{ T('review_form.add_a_review') }}</h3>
      <div class="form-control">
        <label>{{ T('review_form.your_rating') }}</label>
        <app-star-rating
          [interactive]="true"
          (ratingChange)="form.controls.rating.setValue($event)"
        ></app-star-rating>
      </div>
      <div class="form-control">
        <label>{{ T('review_form.your_comment') }}</label>
        <textarea
          formControlName="comment"
          rows="4"
          [placeholder]="T('review_form.write_your_comment_here')"
        ></textarea>
      </div>
      <div class="form-control">
        <label>{{ T('review_form.your_name') }}</label>
        <input
          type="text"
          formControlName="author"
          [placeholder]="T('review_form.your_generous_name')"
        />
      </div>
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
          {{ T('review_form.submit_review') }}
        </button>
      </div>
    </form>
  `,
})
export class ReviewFormComponent {
  private fb = inject(FormBuilder);
  private i18n = inject(I18nService);
  T = this.i18n.t;

  @Output() submitReview = new EventEmitter<{
    rating: number;
    comment: string;
    author: string;
    authorEn: string;
    commentEn: string;
  }>();

  form = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['', Validators.required],
    author: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const rawValue = this.form.getRawValue();
    this.submitReview.emit({
      rating: rawValue.rating!,
      comment: rawValue.comment!,
      author: rawValue.author!,
      authorEn: rawValue.author!,
      commentEn: rawValue.comment!,
    });
    this.form.reset();
  }
}
