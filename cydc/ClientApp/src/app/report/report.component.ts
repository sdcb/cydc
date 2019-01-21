import { Component, OnInit, Input } from '@angular/core';
import { ReportApi } from './report.api';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {
  days = 60;
  dayOrdersData = empty();
  hourOrdersData = empty();
  tasteOrders = new DataLabel();
  locationOrders = new DataLabel();

  constructor(private api: ReportApi) {
  }

  async ngOnInit() {
    this.dayOrdersData = datasetFromArray(await this.api.dayOrders(this.days).toPromise());
    this.hourOrdersData = datasetFromArray(await this.api.hourOrders(this.days).toPromise());
    this.tasteOrders = DataLabel.from(await this.api.tasteOrders(this.days).toPromise());
    this.locationOrders = DataLabel.from(await this.api.locationOrders(this.days).toPromise());
  }
}

export function datasetFromArray(data: number[], label = "数量") {
  return [{ data: data, label: label }];
}

export function datasetFromObject() {
  
}

export function empty() {
  return datasetFromArray([], "");
}

export class DataLabel {
  data = [0];
  labels = [""];

  static from(obj: { [key: string]: number }): DataLabel {
    return {
      data: Object.values(obj), 
      labels: Object.keys(obj)
    }
  }
}