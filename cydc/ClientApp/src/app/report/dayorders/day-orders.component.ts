import { Component, OnInit, Input } from '@angular/core';
import { DayOrdersApi, ReportDataItem } from './day-orders.api';


@Component({
  selector: 'app-day-order',
  templateUrl: './day-orders.component.html',
  styleUrls: ['./day-orders.component.css']
})
export class DayOrderComponent implements OnInit {
  days = 60;
  dayOrdersData: ReportDataItem[] = [];
  hourOrdersData!: any;
  tasteOrdersData: ReportDataItem[] = [];

  constructor(private api: DayOrdersApi) {
  }

  ngOnInit() {
    this.api.dayOrders(this.days).subscribe(v => this.dayOrdersData = v);
    this.api.hourOrders(this.days).subscribe(v => {
      this.hourOrdersData = {name: "数量", series: v};
      console.log(this.hourOrdersData);
    });
    this.api.tasteOrders(this.days).subscribe(v => this.tasteOrdersData = v);
  }
}
