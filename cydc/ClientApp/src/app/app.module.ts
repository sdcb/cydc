import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatPaginatorIntl } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

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
import { AppPaginatorIntl } from './shared/utils/app-paginator-intl';
import { UsersComponent } from './admin/users/users.component';
import { NotAdminComponent } from './admin/not-admin/not-admin.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { MenusComponent } from './admin/menus/menus.component';
import { HoverEditComponent } from './shared/hover-edit/hover-edit.component';

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
    UsersComponent,
    NotAdminComponent,
    OrdersComponent,
    MenusComponent,
    HoverEditComponent, 
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
    LayoutModule, 
    MaterialModule, 
    RouterModule.forRoot(routes), BrowserAnimationsModule
  ],
  providers: [
    { provide: loginProvider, useValue: loginResolver },
    { provide: MatPaginatorIntl, useClass: AppPaginatorIntl, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
