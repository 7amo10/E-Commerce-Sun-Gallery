import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Lang = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private current = signal<Lang>('ar');
  private dict = signal<Record<string, string>>({});

  readonly lang: Signal<Lang> = this.current.asReadonly();
  readonly t = (key: string) => this.dict()[key] ?? key;

  constructor(private http: HttpClient) {
    effect(() => {
      const l = this.current();
      this.http.get<Record<string, string>>(`assets/i18n/${l}.json`).subscribe((d) => this.dict.set(d));
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    });
  }

  switch(lang: Lang) { this.current.set(lang); }
}
