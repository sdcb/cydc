import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MaterialModule } from './shared/material/material.module';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './shared/nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { routes } from './app.routes';
import { loginProvider, loginResolver } from './services/external-redirect';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginComponent } from './shared/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggedOutComponent } from './shared/logged-out/logged-out.component';
import { OrderComponent } from './foodOrder/create/create.component';
import { OrderCreateDialog } from './foodOrder/create/create-dialog';
import { MyFoodOrderComponent } from './foodOrder/my-food-order/my-food-order.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    NotFoundComponent,
    OrderComponent, 
    LoginComponent,
    LoggedOutComponent,
    OrderCreateDialog,
    MyFoodOrderComponent, 
  ],
  entryComponents: [
    OrderCreateDialog
  ], 
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FontAwesomeModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule, 
    RouterModule.forRoot(routes), BrowserAnimationsModule
  ],
  providers: [
    { provide: loginProvider, useValue: loginResolver }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
