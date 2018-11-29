import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userStatus = new UserStatus();
  loaded: boolean = false;

  constructor(private http: HttpClient) {
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

  private getUserStatusAsync() {
    return this.http.get<UserStatus>("/user/status").toPromise()
  }
}

export class UserStatus {
  
  isLoggedIn: boolean = false;
  name: string = "";
  isAdmin: boolean = false;
}
