import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderCreateDialog } from './create-dialog';
import { FoodOrderApiService, FoodOrderMenu, OrderCreateDto } from '../food-order-api.service';
import { Router } from '@angular/router';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';

@Component({
  selector: 'app-order',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class OrderComponent implements OnInit {
  siteNotification: string | null = null;
  selectedMenu: FoodOrderMenu | undefined;
  menus: FoodOrderMenu[] = [];

  isHttps = location.protocol === "https:";

  @ViewChild("confirmDialog")
  confirmDialog!: ElementRef;

  constructor(
    public userService: UserService,
    private dialogService: MatDialog,
    private api: FoodOrderApiService,
    private router: Router,
    private loading: GlobalLoadingService) { }

  async ngOnInit() {
    await this.userService.ensureLogin();

    this.loading.wrapAll(
      this.api.getSiteNotification().toPromise().then(v => this.siteNotification = v), 
      this.api.getTodayMenus().toPromise().then(v => {
        this.menus = v;
        this.selectedMenu = v[0];
    }));
  }

  httpsRedirect() {
    location.href = location.href.replace("http:", "https:");
  }

  async select(menu: FoodOrderMenu) {
    this.selectedMenu = menu;
    await this.showConfirmDialog();
  }

  async showConfirmDialog() {
    const createDialog = this.dialogService.open(OrderCreateDialog, {
      data: this.selectedMenu,
      width: "450px"
    });
    let createDto = await createDialog.afterClosed().toPromise<OrderCreateDto | undefined>();
    if (createDto === undefined) return;

    await this.loading.wrap(this.api.create(createDto).toPromise());
    await this.router.navigateByUrl("/food-order/my");
  }
}
