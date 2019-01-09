import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { AdminApiService } from 'src/app/admin/admin-api.service';

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
    public api: AdminApiService) {
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
}
