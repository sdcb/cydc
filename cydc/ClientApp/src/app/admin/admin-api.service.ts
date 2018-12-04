import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  constructor(private http: HttpClient) { }

  getUsers(name: string, operator: BalanceOperator, skip: number, take: number) {
    return this.http.get<AdminUserDto[]>(`/api/admin/users?skip=${skip}&take=${take}&operator=${operator}&name=${encodeURIComponent(name)}`);
  }
}

export type AdminUserDto = {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export enum BalanceOperator {
  All = 0,
  LessThanZero = 1,
  EqualToZero = 2,
  GreaterThanZero = 3, 
}
