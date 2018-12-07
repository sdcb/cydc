import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalLoadingService } from './global-loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userStatus = new UserStatus();
  private loadingPromise: Promise<any> | undefined = undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loading: GlobalLoadingService) {
    this.loadUserStatus();
  }

  async loadUserStatus() {
    if (this.loadingPromise !== undefined) {
      return await this.loadingPromise;
    } else {
      this.loadingPromise = this.loading.wrap(this.getUserStatusAsync());
      this.userStatus = await this.loadingPromise;
      return this.userStatus;
    }
  }

  async ensureLogin() {
    if (!(await this.loadUserStatus()).isLoggedIn) {
      await this.router.navigateByUrl("/api/user/login", { queryParams: { redirectUrl: location.href } });
    };
  }

  async ensureAdmin() {
    if (!(await this.loadUserStatus()).isAdmin) {
      await this.router.navigateByUrl("/admin/not-admin");
    };
  }

  private getUserStatusAsync() {
    return this.http.get<UserStatus>("api/user/status").toPromise()
  }

  async logout() {
    await this.http.get("/api/user/logout").toPromise();
    await this.router.navigateByUrl("/user/logged-out");
    this.userStatus = new UserStatus();
  }
}

export class UserStatus {
  isLoggedIn: boolean = false;
  name: string = "";
  isAdmin: boolean = false;
}
