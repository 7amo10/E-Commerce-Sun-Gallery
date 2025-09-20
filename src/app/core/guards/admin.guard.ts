import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (this.auth.isAdmin()) return true;
    // redirect to login or home
    return this.router.parseUrl('/auth/login');
  }
}
