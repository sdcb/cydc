import { FoodOrderApiService } from 'src/app/foodOrder/food-order-api.service';
import { Component, OnInit } from '@angular/core';
import { DataManagesApiService } from '../data-manages-api.service';
import { GlobalLoadingService } from 'src/app/services/global-loading.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styles: []
})
export class NotificationComponent implements OnInit {
  rawNotification!: string;
  notification!: string;

  constructor(
    private api: DataManagesApiService,
    private foodOrderApi: FoodOrderApiService,
    private loading: GlobalLoadingService,
    private user: UserService) { }

  showSave() {
    return this.rawNotification != this.notification;
  }

  async ngOnInit() {
    await this.user.ensureAdmin();
    this.rawNotification = await this.loading.wrap(this.foodOrderApi.getSiteNotification().toPromise());
    this.notification = this.rawNotification;
  }

  async save() {
    if (!this.notification) return;
    await this.loading.wrap(this.api.saveSiteNotification(this.notification).toPromise());
    this.rawNotification = this.notification;
  }
}
