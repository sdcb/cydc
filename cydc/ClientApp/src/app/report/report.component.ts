import { Component, OnInit, Input } from '@angular/core';
import { ReportApi } from './report.api';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {
  days = 60;
  dayOrdersData = this.empty();
  hourOrdersData = this.empty();
  tasteOrders = new DataLabel();
  locationOrders = new DataLabel();

  constructor(
    private api: ReportApi,
    private userService: UserService) {
  }

  async ngOnInit() {
    this.dayOrdersData = this.datasetFromArray(await this.api.dayOrders(this.days).toPromise());
    this.hourOrdersData = this.datasetFromArray(await this.api.hourOrders(this.days).toPromise());
    this.tasteOrders = DataLabel.from(await this.api.tasteOrders(this.days).toPromise());
    this.locationOrders = DataLabel.from(await this.api.locationOrders(this.days).toPromise());
  }

  datasetFromArray(data: number[], label: string | undefined = undefined) {
    if (label === undefined) {
      label = this.userService.userStatus.isAdmin ? "数量" : "百分比"
    }
    return [{ data: data, label: label }];
  }

  empty() {
    return this.datasetFromArray([], "");
  }
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
