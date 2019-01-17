import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { AdminApiService } from 'src/app/admin/admin-api.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  todayOrders: number = 0;

  constructor(
    public userService: UserService,
    public size: ScreenSizeService,
    public api: AdminApiService,
    @Inject(LOCALE_ID)private locale: string) {
  }

  async ngOnInit() {
    if (await this.userService.isAdmin()) {
      this.todayOrders = await this.api.todayOrders().toPromise();
    }
  }

  async logout() {
    await this.userService.logout();
  }

  get isAdmin() {
    return this.userService.userStatus.isAdmin;
  }

  get isLoggedIn() {
    return this.userService.userStatus.isLoggedIn;
  }

  getToday() {
    return formatDate(new Date(), "yyyy-MM-dd", this.locale);
  }
}
