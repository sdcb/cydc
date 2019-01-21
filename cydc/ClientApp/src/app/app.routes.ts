import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { loginProvider } from "./services/external-redirect";
import { LoginComponent } from './shared/login/login.component';
import { LoggedOutComponent } from './shared/logged-out/logged-out.component';
import { OrderComponent } from './foodOrder/create/create.component';
import { MyFoodOrderComponent } from './foodOrder/my-food-order/my-food-order.component';
import { UsersComponent } from './admin/users/users.component';
import { NotAdminComponent } from './admin/not-admin/not-admin.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { MenusComponent } from './admin/menus/menus.component';
import { TastesComponent } from './admin/data-manages/tastes/tastes.component';
import { LocationsComponent } from './admin/data-manages/locations/locations.component';
import { NotificationComponent } from './admin/data-manages/notification/notification.component';
import { DayOrderComponent } from './report/dayorders/day-orders.component';
export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: "full",  },
  { path: 'welcome', component: HomeComponent, },
  { path: 'food-order/create', component: OrderComponent },
  { path: 'food-order/my', component: MyFoodOrderComponent },
  { path: 'api/user/login', component: LoginComponent, resolve: { url: loginProvider } },
  { path: 'user/logged-out', component: LoggedOutComponent, },

  { path: 'admin/users', component: UsersComponent, },
  { path: 'admin/orders', component: OrdersComponent, },
  { path: 'admin/menus', component: MenusComponent, },
  { path: 'admin/tastes', component: TastesComponent, },
  { path: 'admin/locations', component: LocationsComponent, },
  { path: 'admin/notification', component: NotificationComponent, },
  { path: 'admin/not-admin', component: NotAdminComponent, },

  { path: 'report', component: DayOrderComponent },
  { path: '**', component: NotFoundComponent },
];
