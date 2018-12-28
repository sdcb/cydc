import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ScreenSizeService } from 'src/app/services/screen-size.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(
    public userService: UserService,
    public size: ScreenSizeService) {
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
