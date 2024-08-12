import { OrderPushService } from './order-push.service';
import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { FoodOrderApiService, LocationDto, TasteDto } from 'src/app/foodOrder/food-order-api.service';
import { UserService } from 'src/app/services/user.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { AdminApiService } from '../admin-api.service';
import { ApiDataSource } from 'src/app/shared/utils/paged-query';
import { FoodOrderDto, AdminOrderQuery, FoodOrderQueryDto } from './admin-user-dtos';
import { UntypedFormControl } from '@angular/forms';
import { debounce } from 'rxjs/operators';
import { timer, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { ConfirmDialog } from 'src/app/shared/dialogs/confirm/confirm.dialog';
import { BatchPayDialog } from './batch-pay.dialog';

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
  userId: string | null = null;

  subscription!: Subscription;
  get displayedColumns() { return this.foodOrderApi.foodOrderColumnsForAdmin(); }

  userNameInput = new UntypedFormControl();

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

    this.route.queryParams.subscribe(async (p: Partial<FoodOrderQueryDto>) => {
      this.query.replaceWith(p);
      this.dataSource.loadData();
      this.userId = p.userName ? await this.api.getUserIdByUserName(p.userName).toPromise() : null;
    });
    this.subscription = await this.orderPushService.subscribe(async orderId => {
      this.dataSource.loadData();
      const order = await this.foodOrderApi.getFoodOrder(orderId).toPromise();
      const msg = `新订单 ${order.userName} ${order.menu}，口味${order.taste}，送到${order.location} ` +
        (order.comment ? `备注 ${order.comment}` : '');
      speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
    });
  }

  exportToExcel() {
    this.api.exportToExcel(this.query.toDto());
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async page(pageIndex: number, pageSize: number) {
    this.query.pageIndex = pageIndex;
    this.query.pageSize = pageSize;
    await this.router.navigate(['.'], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async applySort(sort: Sort) {
    this.query.applySort(sort);
    await this.router.navigate(['.'], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async applyUserName(userName: string) {
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
    await this.router.navigate(['.'], { relativeTo: this.route, queryParams: this.query.toDto() });
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
    if (!await ConfirmDialog.show(this.dialogService, `确定要删除？`)) { return; }

    await this.loading.wrap(this.api.deleteOrder(item.id).toPromise());
    this.dataSource.loadData();
  }

  showBatchPay() {
    return this.userId && !this.dataSource.loading;
  }

  batchPayAmount() {
    return this.dataSource.items
      .filter(x => !x.isPayed)
      .reduce((a, b) => a + b.price, 0);
  }

  async batchPay() {
    if (this.userId === null) { return; }
    const data = {
      userId: this.userId,
      userName: this.query.userName,
      unpayedOrders: this.dataSource.items.filter(x => !x.isPayed && x.userName === this.query.userName)
    };
    if (await BatchPayDialog.show(this.dialogService, data)) {
      this.dataSource.loadData();
    }
  }
}
