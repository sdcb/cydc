import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { PagedResult } from '../shared/utils/paged-query';
import { AdminUserQuery, AdminUserDto } from './users/admin-user-dtos';
import { AdminOrderQuery, FoodOrderDto } from './orders/admin-user-dtos';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  constructor(private http: HttpClient) { }

  getUsers(query: AdminUserQuery) {
    return this.http.get<PagedResult<AdminUserDto>>(`/api/admin/users`, {
      params: <Params>query.toDto()
    });
  }

  getOrders(query: AdminOrderQuery) {
    return this.http.get<PagedResult<FoodOrderDto>>(`/api/admin/orders`, {
      params: <Params>query.toDto()
    });
  }

  resetPassword(id: string, password: string) {
    return this.http.post<boolean>(`/api/admin/resetPassword?userId=${id}`, password);
  }
}
