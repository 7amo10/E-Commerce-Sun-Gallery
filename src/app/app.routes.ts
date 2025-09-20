import { Routes } from "@angular/router";
import { ProductsPage } from "./features/products/products.page";
import { ProductDetailPage } from "./features/products/product-detail.page";
import { CartPage } from "./features/cart/cart.page";
import { CheckoutPage } from "./features/cart/checkout.page";
import { AdminDashboardPage } from "./features/admin/dashboard.page";
import { AdminOrdersPage } from "./features/admin/orders.page";
import { AdminProductsManagementPage } from "./features/admin/products.page";
import { AdminCustomersPage } from "./features/admin/customers.page";
import { OrdersPage } from "./features/orders/orders.page";
import { LoginPage } from "./features/auth/login.page";
import { AdminGuard } from "./core/guards/admin.guard";

export const routes: Routes = [
  { path: "", component: ProductsPage },
  { path: "products", component: ProductsPage },
  { path: "products/:id", component: ProductDetailPage },
  { path: "cart", component: CartPage },
  { path: "checkout", component: CheckoutPage },
  { path: "orders/:id", component: OrdersPage },
  { path: "admin", component: AdminDashboardPage, canActivate: [AdminGuard] },
  { path: "admin/orders", component: AdminOrdersPage, canActivate: [AdminGuard] },
  { path: "admin/products", component: AdminProductsManagementPage, canActivate: [AdminGuard] },
  { path: "admin/customers", component: AdminCustomersPage, canActivate: [AdminGuard] },
  { path: "auth/login", component: LoginPage },
  { path: "**", redirectTo: "" },
];
