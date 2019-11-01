import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  exportToExcel(dto: import("./orders/admin-user-dtos").FoodOrderQueryDto) {
    const fake = <any>dto;
    const filteredDto = Object.keys(dto).filter(v => !!fake[v]).reduce((a, b) => {
      a[b] = fake[b];
      return a;
    }, <any>{});
    open('/api/admin/exportOrders?' + new HttpParams({fromObject: filteredDto}).toString());
  }

  saveOrderComment(orderId: number, comment: string): any {
    return this.http.post(`/api/admin/saveOrderComment?orderId=${orderId}`, comment, {
      responseType: 'text'
    });
  }

  remind(userId: string) {
    return this.http.post(`/api/sms/remind?toUserId=${userId}`, {}, {
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
    return this.http.post(`/api/admin/batchPay`, orderIds, {
      params: {
        userId: userId,
        amount: amount.toString()
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
