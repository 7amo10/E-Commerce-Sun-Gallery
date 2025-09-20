import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DirectionService {
  setDir(dir: 'rtl' | 'ltr') {
    document.documentElement.setAttribute('dir', dir);
  }
}
