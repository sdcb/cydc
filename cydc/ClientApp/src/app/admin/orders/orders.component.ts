import { OrderPushService } from './order-push.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FoodOrderApiService, LocationDto, TasteDto } from 'src/app/foodOrder/food-order-api.service';
import { UserService } from 'src/app/services/user.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { AdminApiService } from '../admin-api.service';
import { ApiDataSource } from 'src/app/shared/utils/paged-query';
import { FoodOrderDto, AdminOrderQuery } from './admin-user-dtos';
import { FormControl } from '@angular/forms';
import { debounce } from 'rxjs/operators';
import { timer, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Sort, MatDialog } from '@angular/material';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { ConfirmDialog } from 'src/app/shared/dialogs/confirm/confirm.dialog';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  dataSource: ApiDataSource<FoodOrderDto>;
  query = new AdminOrderQuery();
  allLocation!: LocationDto[];
  allTaste!: TasteDto[];

  subscription!: Subscription;
  get displayedColumns() { return this.foodOrderApi.foodOrderColumnsForAdmin(); }

  userNameInput = new FormControl();

  constructor(
    private foodOrderApi: FoodOrderApiService,
    private api: AdminApiService,
    private dialogService: MatDialog,
    private userService: UserService,
    public screenSize: ScreenSizeService,
    private router: Router, private route: ActivatedRoute,
    private loading: GlobalLoadingService,
    private orderPushService: OrderPushService) {
    this.dataSource = new ApiDataSource<FoodOrderDto>(() => this.api.getOrders(this.query));
    this.userNameInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyUserName(n));
  }

  async ngOnInit() {
    await this.userService.ensureAdmin();
    this.foodOrderApi.getAllLocation().subscribe(v => this.allLocation = v);
    this.foodOrderApi.getAllTaste().subscribe(v => this.allTaste = v);

    this.route.queryParams.subscribe(p => {
      this.query.replaceWith(p);
      this.dataSource.loadData();
    });
    this.subscription = this.orderPushService.onNewOrder().subscribe(() => {
      speechSynthesis.speak(new SpeechSynthesisUtterance("你有新订单了"));
      this.dataSource.loadData();
    });
    this.orderPushService.start();
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
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

  applyLocationId(locationId: number | undefined) {
    this.query.locationId = locationId;
    this.afterApplied();
  }

  applyTasteId(tasteId: number | undefined) {
    this.query.tasteId = tasteId;
    this.afterApplied();
  }

  async afterApplied() {
    this.query.resetPager();
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async saveComment(comment: string, item: FoodOrderDto) {
    item.comment = await this.api.saveOrderComment(item.id, comment).toPromise();
  }

  async pay(item: FoodOrderDto) {
    await this.loading.wrap(this.api.pay(item.id).toPromise());
    this.dataSource.loadData();
  }

  async unpay(item: FoodOrderDto) {
    await this.loading.wrap(this.api.unpay(item.id).toPromise());
    this.dataSource.loadData();
  }

  async delete(item: FoodOrderDto) {
    if (!await ConfirmDialog.show(this.dialogService, `确定要删除？`)) return;

    await this.loading.wrap(this.api.deleteOrder(item.id).toPromise());
    this.dataSource.loadData();
  }
}
