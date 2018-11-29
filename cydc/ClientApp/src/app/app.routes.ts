import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { loginProvider } from "./services/external-redirect";
import { LoginComponent } from './shared/login/login.component';
import { LoggedOutComponent } from './shared/logged-out/logged-out.component';
import { OrderComponent } from './foodOrder/create/create.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'food-order/create', component: OrderComponent },
  { path: 'api/user/login', component: LoginComponent, resolve: { url: loginProvider } },
  { path: 'user/logged-out', component: LoggedOutComponent, }, 
  { path: '**', component: NotFoundComponent }, 
];
