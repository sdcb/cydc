import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userStatus = new UserStatus();

  constructor(private http: HttpClient) {
    this.loadUserStatus();
  }

  private async loadUserStatus() {
    this.userStatus = await this.http.get<UserStatus>("/user/status").toPromise();
    return this.userStatus;
  }
}

export class UserStatus {
  isLoggedIn: boolean = false;
  name: string = "";
  isAdmin: boolean = false;
}
