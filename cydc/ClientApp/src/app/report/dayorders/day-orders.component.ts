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
  hourOrdersData: ReportDataItem[] = [];
  tasteOrdersData: ReportDataItem[] = [];

  constructor(private api: DayOrdersApi) {
  }

  ngOnInit() {
    this.api.dayOrders(this.days).subscribe(v => this.dayOrdersData = v);
    this.api.hourOrders(this.days).subscribe(v => this.hourOrdersData = v);
    this.api.tasteOrders(this.days).subscribe(v => this.tasteOrdersData = v);
  }
}
