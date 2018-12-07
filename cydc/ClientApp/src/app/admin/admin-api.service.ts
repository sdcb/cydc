import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Params } from '@angular/router';

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
}

export interface PagedDto {
  page: string;
  pageSize: string;
}

export interface UserQueryDto extends PagedDto {
  operator: string;
  name: string;
}

export class PagedQuery {
  pageIndex!: number;
  pageSize!: number;

  constructor() {
    this.reset();
  }

  page() { return this.pageIndex + 1; }

  replaceWith(p: Partial<PagedDto>) {
    this.pageIndex = p.page ? parseInt(p.page) - 1 : 0;
    this.pageSize = parseInt(p.pageSize!) || 12;
  }

  toDto(): PagedDto {
    let o = <PagedDto>{};
    if (this.pageIndex !== 0) o.page = this.page().toString();
    if (this.pageSize !== 12) o.pageSize = this.pageSize.toString();
    return o;
  }

  protected reset() {
    this.pageIndex = 0;
    this.pageSize = 12;
  }
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

export class PagedResult<T> {
  pagedData: T[] = [];
  totalCount: number = 0;
}

export enum BalanceOperator {
  All = 0,
  LessThanZero = 1,
  EqualToZero = 2,
  GreaterThanZero = 3, 
}

export class ApiDataSource<TData> extends DataSource<TData> {
  dataSubject = new BehaviorSubject(new PagedResult<TData>());
  dataCount: number = 0;
  loading = false;

  constructor(private searchApi: () => Observable<PagedResult<TData>>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<TData[]> {
    return this.dataSubject.pipe(map(x => x.pagedData));
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.dataSubject.complete();
  }

  loadData() {
    this.loading = true;
    this.searchApi()
      .pipe(finalize(() => this.loading = false))
      .subscribe(data => {
        this.dataSubject.next(data);
        this.dataCount = data.totalCount;
      });
  }
}
