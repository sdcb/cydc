import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FoodOrderItem, FoodOrderApiService } from 'src/app/foodOrder/food-order-api.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  dataSource = new MatTableDataSource<FoodOrderItem>();
  balance!: number;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private api: FoodOrderApiService,
    private userService: UserService,
    private loading: GlobalLoadingService,
    public screenSize: ScreenSizeService) {
  }

  async ngOnInit() {
    await this.userService.ensureAdmin();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.data = await this.loading.wrap(this.api.getMyFoodOrder().toPromise());
    this.api.getMyBalance().subscribe(v => this.balance = v);
  }

  get displayedColumns() {
    if (this.screenSize.md)
      return ["orderTime", "menu", "comment", "price", "isPayed"];
    else if (this.screenSize.lg)
      return ["id", "orderTime", "menu", "comment", "price", "isPayed"]
    else
      return ["id", "userName", "orderTime", "menu", "comment", "price", "isPayed"];
  };
}
