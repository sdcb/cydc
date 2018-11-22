import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { loginProvider } from "./services/external-redirect";
import { OrderComponent } from "./user/order/order.component";

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'user/order', component: OrderComponent }, 
  { path: 'user/login', component: NotFoundComponent, resolve: {url: loginProvider}}
];
