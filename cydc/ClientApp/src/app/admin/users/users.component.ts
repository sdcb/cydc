import { BatchPayDialog } from './../orders/batch-pay.dialog';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AdminApiService } from '../admin-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounce } from 'rxjs/operators';
import { ApiDataSource } from 'src/app/shared/utils/paged-query';
import { AdminUserQuery, AdminUserDto, BalanceOperator } from './admin-user-dtos';
import { Sort, MatDialog } from '@angular/material';
import { PasswordResetDialog as PasswordResetDialog } from './password-reset.dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns = ["name", "email", "balance", "orderCount", "action"];
  query = new AdminUserQuery();
  dataSource: ApiDataSource<AdminUserDto>;

  nameInput = new FormControl("");
  emailInput = new FormControl("");

  constructor(
    private userService: UserService,
    private api: AdminApiService,
    private router: Router, private route: ActivatedRoute,
    private dialogService: MatDialog,
    private loading: GlobalLoadingService) {
    this.dataSource = new ApiDataSource<AdminUserDto>(() => this.api.getUsers(this.query));
    this.nameInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyName(n));
    this.emailInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyEmail(n));
  }

  async ngOnInit() {
    await this.userService.ensureAdmin();
    this.route.queryParams.subscribe(p => {
      this.query.replaceWith(p);
      this.dataSource.loadData();
    });
  }

  async applySort(sort: Sort) {
    this.query.applySort(sort);
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async page(pageIndex: number, pageSize: number) {
    this.query.pageIndex = pageIndex;
    this.query.pageSize = pageSize;
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async applyOperator(operator: BalanceOperator) {
    this.query.operator = operator;
    this.query.resetPager();
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async applyName(name: string) {
    this.query.name = name;
    this.query.resetPager();
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async applyEmail(email: string) {
    this.query.email = email;
    this.query.resetPager();
    await this.router.navigate(["."], { relativeTo: this.route, queryParams: this.query.toDto() });
  }

  async resetPassword(user: AdminUserDto) {
    const password = await PasswordResetDialog.getPassword(this.dialogService, user);
    if (password === undefined) return;
    if (await this.loading.wrap(this.api.resetPassword(user.id, password).toPromise())) {
      alert("密码重置成功，请发送给用户");
    } else {
      alert("密码重置失败");
    }
  }

  async charge(item: AdminUserDto) {
    if (await BatchPayDialog.show(this.dialogService, {
      userId: item.id,
      userName: item.name,
      unpayedOrders: [],
    })) { this.dataSource.loadData(); }
  }
}
