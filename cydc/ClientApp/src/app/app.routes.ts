import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { loginProvider } from "./services/external-redirect";

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'user/login', component: NotFoundComponent, resolve: {url: loginProvider}}
];
