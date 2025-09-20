import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-10">
      <div class="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">
            {{ mode() === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد" }}
          </h1>
          <p class="text-gray-600">
            {{
              mode() === "login"
                ? "سجّل للوصول إلى لوحة الإدارة وتتبع الطلبات."
                : "أنشئ حسابًا لبدء التسوق وإدارة طلباتك."
            }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
          <div class="flex gap-2 mb-4">
            <button
              class="btn"
              [class.bg-brand-primary]="mode() === 'login'"
              (click)="mode.set('login')"
            >
              دخول
            </button>
            <button
              class="btn"
              [class.bg-brand-primary]="mode() === 'signup'"
              (click)="mode.set('signup')"
            >
              تسجيل
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3">
            <div *ngIf="mode() === 'signup'">
              <label class="block text-sm">الاسم</label>
              <input
                formControlName="name"
                class="w-full rounded-lg border border-black/10 px-3 py-2"
              />
            </div>

            <div>
              <label class="block text-sm">البريد الإلكتروني</label>
              <input
                formControlName="email"
                type="email"
                class="w-full rounded-lg border border-black/10 px-3 py-2"
              />
            </div>

            <div>
              <label class="block text-sm">كلمة المرور</label>
              <input
                formControlName="password"
                type="password"
                class="w-full rounded-lg border border-black/10 px-3 py-2"
              />
            </div>

            <!-- Signup is customer only -->
            <div *ngIf="mode() === 'signup'" class="flex items-center gap-2">
              <input
                type="checkbox"
                formControlName="remember"
                id="remember"
                class="h-4 w-4"
              />
              <label for="remember" class="text-sm">تذكرني</label>
            </div>

            <div *ngIf="error" class="text-sm text-red-600">{{ error }}</div>

            <div class="flex gap-2">
              <button class="btn btn-primary flex-1" type="submit">
                {{ mode() === "login" ? "دخول" : "إنشاء حساب" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  mode = signal<"login" | "signup">("login");
  error = "";

  form = new FormBuilder().group({
    name: [""],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  async onSubmit() {
    this.error = "";
    if (this.mode() === "login") {
      const email = (this.form.value.email ?? "") as string;
      const password = (this.form.value.password ?? "") as string;
      const res: any = this.auth.login(email, password, undefined, true);
      if (!res.ok) {
        this.error = res.message ?? "بيانات الدخول غير صحيحة";
        return;
      }
      // redirect based on role
      const role = res.user?.role ?? "customer";
      if (role === "admin") {
        await this.router.navigateByUrl("/admin");
      } else {
        await this.router.navigateByUrl("/");
      }
    } else {
      // signup (customer only)
      const name = (this.form.value.name ?? "") as string;
      const email = (this.form.value.email ?? "") as string;
      const password = (this.form.value.password ?? "") as string;
      const remember = !!this.form.value.remember;
      const r: any = this.auth.register(
        name || "عميل",
        email,
        password,
        "customer",
      );
      if (!r.ok) {
        this.error = r.message ?? "فشل التسجيل";
        return;
      }
      // auto-login after signup honoring remember
      const loginRes: any = this.auth.login(
        email,
        password,
        undefined,
        remember,
      );
      if (loginRes.ok) {
        await this.router.navigateByUrl("/");
      }
    }
  }
}
