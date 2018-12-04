import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AdminUserDto, AdminApiService, ApiDataSource, AdminUserQuery } from '../admin-api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns = ["name", "email", "balance"];
  query = new AdminUserQuery();
  dataSource: ApiDataSource<AdminUserDto, AdminUserQuery>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private userService: UserService,
    private api: AdminApiService) {
    this.dataSource = new ApiDataSource<AdminUserDto, AdminUserQuery>(s => this.api.getUsers(s));
  }

  async ngOnInit() {
    await this.userService.ensureAdmin();

    this.dataSource.loadData(this.query);
    this.paginator.page.subscribe(() => {
      this.query.pageIndex = this.paginator.pageIndex;
      this.query.pageSize = this.paginator.pageSize;
      this.dataSource.loadData(this.query);
    });
    //this.dataSource.
  }
}
