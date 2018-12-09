import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AdminUserDto, AdminApiService, ApiDataSource, AdminUserQuery, BalanceOperator } from '../admin-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounce } from 'rxjs/operators';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns = ["name", "email", "balance"];
  query = new AdminUserQuery();
  dataSource: ApiDataSource<AdminUserDto>;
  nameInput = new FormControl();

  constructor(
    private userService: UserService,
    private api: AdminApiService,
    private router: Router, private route: ActivatedRoute,
    private size: ScreenSizeService) {
    this.dataSource = new ApiDataSource<AdminUserDto>(() => this.api.getUsers(this.query));
    this.nameInput.valueChanges.pipe(debounce(() => timer(500))).subscribe(n => this.applyName(n));
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
}
