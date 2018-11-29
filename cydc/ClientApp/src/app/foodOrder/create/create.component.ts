import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { OrderCreateDialog, OrderCreateDto } from './create-dialog';

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
    private http: HttpClient,
    public userService: UserService,
    private dialogService: MatDialog) { }

  async ngOnInit() {
    await this.userService.ensureLogin();

    this.http.get("/api/foodOrder/siteNotification", { responseType: "text" }).subscribe(v => this.siteNotification = v);
    this.http.get<FoodOrderMenu[]>("/api/info/menu").subscribe(v => {
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

export type FoodOrderMenu = {
  id: number;
  title: string;
  price: string;
  details: string;
}
