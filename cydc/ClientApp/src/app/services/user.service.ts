import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userStatus: UserStatus = {
    isLoggedIn: false,
    claims: {}
  };

  constructor(private http: HttpClient) {
    this.loadUserStatus();
  }

  private async loadUserStatus() {
    this.userStatus = await this.http.get<UserStatus>("/user/status").toPromise();
    return this.userStatus;
  }
}

export type UserStatus = {
  isLoggedIn: boolean;
  claims: {
    [key: string]: string
  }
}
