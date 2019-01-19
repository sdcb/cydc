import { Component, OnInit } from '@angular/core';
import { DayOrdersApi } from './day-orders.api';


@Component({
  selector: 'app-day-order',
  templateUrl: './day-orders.component.html'
})
export class DayOrderComponent implements OnInit {
  data = [[0]];
  labels = ["数量"];

  constructor(private api: DayOrdersApi) {
  }

  ngOnInit() {
    this.api.dayOrders(60).subscribe(v => this.data = [v]);
  }
}
