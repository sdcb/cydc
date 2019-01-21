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
  tasteOrders = {};
  locationOrders = {};

  constructor(private api: DayOrdersApi) {
  }

  async ngOnInit() {
    this.dayOrdersData = datasetFromArray(await this.api.dayOrders(this.days).toPromise());
    this.hourOrdersData = datasetFromArray(await this.api.hourOrders(this.days).toPromise());
    this.tasteOrders = datasetFromObject(await this.api.tasteOrders(this.days).toPromise());
    this.locationOrders = datasetFromObject(await this.api.locationOrders(this.days).toPromise());
  }
}

export function datasetFromArray(data: number[], label = "数量") {
  return [{ data: data, label: label }];
}

export function datasetFromObject(obj: { [key: string]: number }) {
  return {
    data: Object.values(obj), 
    labels: Object.keys(obj)
  }
}

export function empty() {
  return datasetFromArray([], "");
}
