import { Component, OnInit } from '@angular/core';
import { menuColumns, AdminMenuQuery, MenuDto } from './admin-menu-dtos';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiDataSource } from 'src/app/shared/utils/paged-query';
import { AdminApiService } from '../admin-api.service';
import { Sort } from '@angular/material';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs';

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
    private api: AdminApiService) {
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
}
