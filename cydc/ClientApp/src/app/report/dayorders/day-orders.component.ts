import { Component, OnInit, Input } from '@angular/core';
import { DayOrdersApi } from './day-orders.api';


@Component({
  selector: 'app-day-order',
  templateUrl: './day-orders.component.html'
})
export class DayOrderComponent implements OnInit {
  days = 60;
  dayOrdersData = empty();
  hourOrdersData = empty();
  tasteOrdersData = [0];
  tasteOrdersLabels = ["辣", "清淡"];

  constructor(private api: DayOrdersApi) {
  }

  ngOnInit() {
    this.api.dayOrders(this.days).subscribe(v => this.dayOrdersData = datasetFromArray(v));
    this.api.hourOrders(this.days).subscribe(v => this.hourOrdersData = datasetFromArray(v));
    this.api.tasteOrders(this.days).subscribe(v => {
      this.tasteOrdersData = Object.values(v);
      this.tasteOrdersLabels = Object.keys(v);
      console.log(this.tasteOrdersData, this.tasteOrdersLabels);
    });
  }
}

export function datasetFromArray(data: number[], label = "数量") {
  return [{ data: data, label: label }];
}

export function datasetFromObject(obj: { [key: string]: number }) {
  return Object.entries(obj).map(x => {
    return { data: [x[1]], label: "数量" };
  });
}

export function empty() {
  return datasetFromArray([], "");
}
