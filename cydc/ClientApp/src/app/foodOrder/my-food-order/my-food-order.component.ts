import { Component, OnInit } from '@angular/core';
import { FoodOrderApiService, FoodOrderItem } from '../food-order-api.service';




@Component({
  selector: 'app-my-food-order',
  templateUrl: './my-food-order.component.html',
  styleUrls: ['./my-food-order.component.css']
})
export class MyFoodOrderComponent implements OnInit {
  displayedColumns: string[];
  dataSource: FoodOrderItem[] = [];

  constructor(private api: FoodOrderApiService) {
    this.displayedColumns = api.foodOrderDisplayColumns();
  }

  ngOnInit() {
    this.api.getMyFoodOrder().subscribe(v => this.dataSource = v);
  }
}
