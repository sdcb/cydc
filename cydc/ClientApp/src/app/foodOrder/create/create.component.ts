import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderCreateDialog, OrderCreateDto } from './create-dialog';
import { FoodOrderApiService, FoodOrderMenu } from '../food-order-api.service';

@Component({
  selector: 'app-order',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class OrderComponent implements OnInit {
  siteNotification: string | null = null;
  selectedMenu: FoodOrderMenu | undefined;
  menus: FoodOrderMenu[] = [];

  @ViewChild("confirmDialog")
  confirmDialog!: ElementRef;

  constructor(
    public userService: UserService,
    private dialogService: MatDialog,
    private api: FoodOrderApiService) { }

  async ngOnInit() {
    await this.userService.ensureLogin();

    this.api.getSiteNotification().subscribe(v => this.siteNotification = v);
    this.api.getTodayMenus().subscribe(v => {
      this.menus = v;
      this.selectedMenu = v[0];
    });
    
  }

  async submit() {
    const createDialog = this.dialogService.open(OrderCreateDialog, {
      data: this.selectedMenu,
    });
    let createDto = await createDialog.afterClosed().toPromise<OrderCreateDto | undefined>();
    console.log(createDto);
  }
}
