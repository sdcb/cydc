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

  saveOrderComment(orderId: number, comment: string): any {
    return this.http.post(`/api/admin/saveOrderComment?orderId=${orderId}`, comment, {
      responseType: 'text'
    });
  }

  resetPassword(id: string, password: string) {
    return this.http.post<boolean>(`/api/admin/resetPassword?userId=${id}`, password);
  }

  todayOrders() {
    return this.http.get<number>(`/api/admin/todayOrders`);
  }

  deleteOrder(orderId: number) {
    return this.http.post(`/api/admin/deleteOrder?orderId=${orderId}`, {});
  }

  pay(orderId: number) {
    return this.http.post(`/api/admin/pay?orderId=${orderId}`, {});
  }

  unpay(orderId: number) {
    return this.http.post(`/api/admin/unpay?orderId=${orderId}`, {});
  }

  batchPay(userId: string, orderIds: number[], amount: number) {
    return this.http.post(`/api/admin/batchPay`, {
      params: {
        userId: userId,
        orderIds: orderIds,
        amount: amount
      }
    });
  }

  getUserIdByUserName(userName: string) {
    return this.http.get(`/api/admin/getUserIdByUserName`, {
      params: { userName: userName },
      responseType: 'text',
    });
  }
}
