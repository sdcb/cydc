import { Component, OnInit, ViewChild } from '@angular/core';
import { FoodOrderApiService, FoodOrderItem } from '../food-order-api.service';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-my-food-order',
  templateUrl: './my-food-order.component.html',
  styleUrls: ['./my-food-order.component.css']
})
export class MyFoodOrderComponent implements OnInit {
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
    await this.userService.ensureLogin();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.data = await this.loading.wrap(this.api.getMyFoodOrder().toPromise());
    this.api.getMyBalance().subscribe(v => this.balance = v);
  }

  async saveComment(value: string, item: FoodOrderItem) {
    item.comment = await this.api.saveComment(item.id, value).toPromise();
  }

  isToday(item: FoodOrderItem) {
    new Date(item.orderTime).getDate() === new Date().getDate();
  }

  get displayedColumns() {
    return this.api.foodOrderColumns();
  };
}
