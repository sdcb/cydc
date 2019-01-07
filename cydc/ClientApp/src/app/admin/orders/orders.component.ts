import { Component, OnInit } from '@angular/core';
import { FoodOrderApiService } from 'src/app/foodOrder/food-order-api.service';
import { UserService } from 'src/app/services/user.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { AdminApiService } from '../admin-api.service';
import { ApiDataSource } from 'src/app/shared/utils/paged-query';
import { FoodOrderDto, AdminOrderQuery } from './admin-user-dtos';
import { FormControl } from '@angular/forms';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  dataSource: ApiDataSource<FoodOrderDto>;
  query = new AdminOrderQuery();
  displayedColumns = this.foodOrderApi.foodOrderColumns();

  userNameInput = new FormControl();

  constructor(
    private foodOrderApi: FoodOrderApiService,
    private api: AdminApiService,
    private userService: UserService,
    public screenSize: ScreenSizeService,
    private router: Router, private route: ActivatedRoute, 
    private loading: GlobalLoadingService) {
    this.dataSource = new ApiDataSource<FoodOrderDto>(() => this.api.getOrders(this.query));
    this.userNameInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyUserName(n));
  }

  async ngOnInit() {
    await this.userService.ensureAdmin();
    this.route.queryParams.subscribe(p => {
      this.query.replaceWith(p);
      this.dataSource.loadData();
    });
  }

  async page(pageIndex: number, pageSize: number) {
    this.query.pageIndex = pageIndex;
    this.query.pageSize = pageSize;
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async applySort(sort: Sort) {
    this.query.applySort(sort);
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  applyUserName(userName: string) {
    this.query.userName = userName;
    this.afterApplied();
  }

  applyStartTime(startTime: string) {
    this.query.startTime = startTime;
    this.afterApplied();
  }

  applyEndTime(endTime: string) {
    this.query.endTime = endTime;
    this.afterApplied();
  }

  applyIsPayed(isPayed: boolean) {
    this.query.isPayed = isPayed;
    this.afterApplied();
  }

  async afterApplied() {
    this.query.resetPager();
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async pay(item: FoodOrderDto) {
    await this.loading.wrap(this.api.pay(item.id).toPromise());
    this.dataSource.loadData();
  }

  async delete(item: FoodOrderDto) {
    await this.loading.wrap(this.api.deleteOrder(item.id).toPromise());
    this.dataSource.loadData();
  }
}
