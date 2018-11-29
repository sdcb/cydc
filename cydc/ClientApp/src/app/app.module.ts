import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './shared/nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { routes } from './app.routes';
import { loginProvider, loginResolver } from './services/external-redirect';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { OrderComponent } from './user/order/order.component';
import { LoginComponent } from './shared/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    NotFoundComponent,
    OrderComponent,
    LoginComponent, 
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FontAwesomeModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, 
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: loginProvider, useValue: loginResolver }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
