import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Params } from '@angular/router';
import { OrderCreateDto } from '../foodOrder/food-order-api.service';
import { PagedResult, PagedDto, PagedQuery } from '../shared/utils/paged-query';

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
    return this.http.get<PagedResult<OrderCreateDto>>(`/api/admin/orders`, {
      params: <Params>query.toDto()
    });
  }
}



export interface UserQueryDto extends PagedDto {
  operator: string;
  name: string;
}

export class AdminUserQuery extends PagedQuery {
  name: string = "";
  operator: BalanceOperator = BalanceOperator.All;

  replaceWith(p: Partial<UserQueryDto>) {
    super.replaceWith(p);
    this.name = p.name || "";
    this.operator = parseInt(p.operator!) || BalanceOperator.All;    
  }

  toDto(): UserQueryDto {
    let o = <UserQueryDto>super.toDto();
    if (this.name !== "") o.name = this.name;
    if (this.operator !== BalanceOperator.All) o.operator = this.operator.toString();
    return o;
  }

  resetPager() {
    super.reset();
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

export class AdminOrderQuery extends PagedQuery {
  toDto() {
    return {};
  }
}
