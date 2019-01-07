import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AdminApiService } from '../admin-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounce } from 'rxjs/operators';
import { ApiDataSource } from 'src/app/shared/utils/paged-query';
import { AdminUserQuery, AdminUserDto, BalanceOperator } from './admin-user-dtos';
import { Sort } from '@angular/material';

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
    private router: Router, private route: ActivatedRoute) {
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

  resetPassword() {
    alert("TBD");
  }
}
