import { ConfirmDialog } from './shared/dialogs/confirm/confirm.dialog';
import { PromptDialog } from 'src/app/shared/dialogs/prompt/prompt.dialog';
import { PasswordResetDialog as PasswordResetDialog } from './admin/users/password-reset.dialog';
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
import { ClickEditComponent } from './shared/click-edit/click-edit.component';
import { MenuCreateDialog } from './admin/menus/menu-create.dialog';
import { TastesComponent } from './admin/data-manages/tastes/tastes.component';
import { LocationsComponent } from './admin/data-manages/locations/locations.component';
import { NotificationComponent } from './admin/data-manages/notification/notification.component';
import { SafeHtmlPipe } from './shared/pipes/safe-html.pipe';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { BatchPayDialog } from './admin/orders/batch-pay.dialog';

const dialogs = [
  OrderCreateDialog,
  MenuCreateDialog,
  PasswordResetDialog,
  PromptDialog, 
  ConfirmDialog, 
  BatchPayDialog
];

const pipes = [
  SafeHtmlPipe, TruncatePipe
];

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    NotFoundComponent,
    OrderComponent,
    LoginComponent,
    LoggedOutComponent,
    MyFoodOrderComponent,
    UsersComponent,
    NotAdminComponent,
    OrdersComponent,
    MenusComponent,
    ClickEditComponent,
    TastesComponent,
    LocationsComponent,
    NotificationComponent,
    ...dialogs,
    ...pipes,
  ],
  entryComponents: [ ...dialogs ],
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
  exports: [ ...pipes ],
  providers: [
    { provide: loginProvider, useValue: loginResolver },
    { provide: MatPaginatorIntl, useClass: AppPaginatorIntl, }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
