import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private userStatus: UserStatus | null = null;

  async getUserStatus() {
    if (this.userStatus !== null) return this.userStatus;

    console.log("get user status...");
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
