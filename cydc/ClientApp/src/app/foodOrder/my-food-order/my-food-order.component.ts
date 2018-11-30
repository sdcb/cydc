import { Component, OnInit, ViewChild } from '@angular/core';
import { FoodOrderApiService, FoodOrderItem } from '../food-order-api.service';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-my-food-order',
  templateUrl: './my-food-order.component.html',
  styleUrls: ['./my-food-order.component.css']
})
export class MyFoodOrderComponent implements OnInit {
  displayedColumns = ["id", "orderTime", "menu", "comment", "price", "isPayed"];
  dataSource = new MatTableDataSource<FoodOrderItem>();
  balance = NaN;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;


  constructor(
    private api: FoodOrderApiService,
    private userService: UserService) {
  }

  async ngOnInit() {
    await this.userService.ensureLogin();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.api.getMyFoodOrder().subscribe(v => {
      this.dataSource.data = v;
    });

    this.api.getMyBalance().subscribe(v => this.balance = v);
  }
}
