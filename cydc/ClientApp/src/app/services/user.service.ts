import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userStatus = new UserStatus();
  loaded: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router) {
    this.loadUserStatus();
  }

  async loadUserStatus() {
    if (this.loaded) {
      return this.userStatus;
    } else {
      this.userStatus = await this.getUserStatusAsync();
      this.loaded = true;
      return this.userStatus;
    }
  }

  async ensureLogin() {
    if (!(await this.loadUserStatus()).isLoggedIn) {
      await this.router.navigateByUrl("/api/user/login", { queryParams: { redirectUrl: "/user/order" } });
    };
  }

  private getUserStatusAsync() {
    return this.http.get<UserStatus>("api/user/status").toPromise()
  }

  async logout() {
    await this.http.post("/user/logout", {});
    await this.router.navigateByUrl("/user/logged-out");
    this.userStatus = new UserStatus();
  }
}

export class UserStatus {
  isLoggedIn: boolean = false;
  name: string = "";
  isAdmin: boolean = false;
}
