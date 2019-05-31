import { Component, OnInit } from '@angular/core';
import { AdminMenuApi } from './admin-menu-api';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiDataSource } from 'src/app/shared/utils/paged-query';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Sort } from '@angular/material/sort';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { MenuCreateDialog } from './menu-create.dialog';
import { AdminMenuQuery, MenuDto } from './admin-menu-dtos';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {
  detailsInput = new FormControl();
  priceInput = new FormControl();
  query = new AdminMenuQuery();
  dataSource: ApiDataSource<MenuDto>;

  constructor(
    public screenSize: ScreenSizeService,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute,
    private api: AdminMenuApi,
    private loading: GlobalLoadingService,
    private dialogService: MatDialog) {
    this.dataSource = new ApiDataSource<MenuDto>(() => this.api.getMenus(this.query));
    this.detailsInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyDetails(n));
    this.priceInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyPrice(n));
  }

  get displayedColumns() {
    if (this.screenSize.md) return ["createTime", "details", "price", "orderCount", "enabled"];
    return ["id", "createTime", "title", "details", "price", "orderCount", "enabled", "action"];
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

  async afterApplied() {
    this.query.resetPager();
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  applyDetails(details: string) {
    this.query.details = details;
    this.afterApplied();
  }

  applyPrice(price: number) {
    this.query.price = price;
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

  async toggleStatus(item: MenuDto) {
    item.enabled = await this.loading.wrap(this.api.toggleStatus(item.id).toPromise());
  }

  async saveDetails(editValue: string, item: MenuDto) {
    item.details = await this.api.saveContent(item.id, editValue).toPromise();
  }

  async saveTitle(editValue: string, item: MenuDto) {
    item.title = await this.api.saveTitle(item.id, editValue).toPromise();
  }

  async savePrice(editValue: string, item: MenuDto) {
    item.price = await this.api.savePrice(item.id, editValue).toPromise();
  }

  async delete(item: MenuDto) {
    if (confirm("确定删除？")) {
      await this.loading.wrap(this.api.delete(item.id).toPromise());
      this.dataSource.loadData();
    }
  }

  async showAddDialog() {
    let dto = await MenuCreateDialog.getCreateDto(this.dialogService);
    if (dto === undefined) return;

    await this.loading.wrap(this.api.createMenu(dto).toPromise());
    this.query.resetPager();
    this.dataSource.loadData();
  }
}
