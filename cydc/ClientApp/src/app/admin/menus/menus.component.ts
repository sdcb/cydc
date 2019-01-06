import { Component, OnInit } from '@angular/core';
import { menuColumns, AdminMenuQuery, MenuDto, AdminMenuApi, MenuEditDto } from './admin-menu-api';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiDataSource } from 'src/app/shared/utils/paged-query';
import { Sort, MatInput } from '@angular/material';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';

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
    private loading: GlobalLoadingService) {
    this.dataSource = new ApiDataSource<MenuDto>(() => this.api.getMenus(this.query));
    this.detailsInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyDetails(n));
    this.priceInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyPrice(n));
  }

  get displayedColumns() {
    return menuColumns(this.screenSize);
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
    item.details = await this.loading.wrap(this.api.saveContent(item.id, editValue).toPromise());
  }

  commitContent(item: MenuEditDto) {
    console.log(item.detailsToSave);
    if (!item.detailsToSave) return;
    this.loading.wrap(this.api.saveContent(item.id, item.detailsToSave).toPromise()).then(v => {
      item.details = v;
      item.editMode = false;
    });
  }
}
