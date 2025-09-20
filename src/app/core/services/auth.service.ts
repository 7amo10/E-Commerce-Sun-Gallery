import { Injectable, signal } from "@angular/core";

export type Role = "guest" | "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const USERS_KEY = "sun_users_v1";
const CURRENT_KEY = "sun_current_user_v1";
import { ADMIN_REG_CODE } from "../../config/app.config";

@Injectable({ providedIn: "root" })
export class AuthService {
  private userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();

  constructor() {
    const rawLocal = localStorage.getItem(CURRENT_KEY);
    const rawSession = sessionStorage.getItem(CURRENT_KEY);
    const raw = rawLocal ?? rawSession;
    if (raw) {
      try {
        this.userSignal.set(JSON.parse(raw));
      } catch {}
    }
    // seed default admin and customer if no users
    const users = this.getUsers();
    if (users.length === 0) {
      this.saveUsers([
        {
          id: "admin",
          name: "Admin",
          email: "admin@sun.gallery",
          role: "admin",
          password: "AdminPass123",
        } as any,
        {
          id: "cust",
          name: "Customer",
          email: "customer@sun.gallery",
          role: "customer",
          password: "Customer123",
        } as any,
      ]);
    }
  }

  private getUsers(): any[] {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      return [];
    }
  }
  private saveUsers(list: any[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  }

  register(
    name: string,
    email: string,
    password: string,
    role: Role,
    adminCode?: string,
  ) {
    const users = this.getUsers();
    if (users.find((u) => u.email === email))
      return { ok: false, message: "Email already registered" };
    if (role === "admin" && adminCode !== ADMIN_REG_CODE)
      return { ok: false, message: "Invalid admin registration code" };
    const id = Date.now().toString(36);
    users.push({ id, name, email, role, password });
    this.saveUsers(users);
    return { ok: true };
  }

  login(
    email: string,
    password: string,
    requiredRole?: Role,
    remember: boolean = true,
  ) {
    const users = this.getUsers();
    const u = users.find((u) => u.email === email && u.password === password);
    if (!u) return { ok: false, message: "Invalid credentials" };
    if (requiredRole && u.role !== requiredRole)
      return { ok: false, message: "Not allowed for this role" };
    const user: User = { id: u.id, name: u.name, email: u.email, role: u.role };
    this.userSignal.set(user);
    try {
      if (remember) {
        localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
        sessionStorage.removeItem(CURRENT_KEY);
      } else {
        sessionStorage.setItem(CURRENT_KEY, JSON.stringify(user));
        localStorage.removeItem(CURRENT_KEY);
      }
    } catch {}
    return { ok: true, user };
  }

  logout() {
    this.userSignal.set(null);
    try {
      localStorage.removeItem(CURRENT_KEY);
      sessionStorage.removeItem(CURRENT_KEY);
    } catch {}
  }

  isAdmin() {
    return !!this.userSignal() && this.userSignal()!.role === "admin";
  }
}
