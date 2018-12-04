import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  constructor(private http: HttpClient) { }

  getUsers(query: AdminUserQuery) {
    let params = new HttpParams({
      fromObject: {
        skip: query.skip.toString(),
        take: query.take.toString(),
        operator: query.operator.toString(), 
      }
    });
    if (query.name) params.append("name", query.name);
    return this.http.get<AdminUserDto[]>("/api/admin/users", { params: params});
  }
}

export class PagedQuery {
  get skip() { return this.pageIndex * this.pageSize; }
  get take() { return this.pageSize; }

  constructor(
    public pageIndex: number = 0,
    public pageSize: number = 12) {
  }
}

export class AdminUserQuery extends PagedQuery {
  name: string | undefined;
  operator: BalanceOperator = BalanceOperator.LessThanZero;
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

export class ApiDataSource<T, S> extends DataSource<T> {
  dataSubject = new BehaviorSubject<T[]>([]);
  loading = false;

  constructor(private searchApi: (searchDto: S) => Observable<T[]>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.dataSubject.complete();
  }

  loadData(searchDto: S) {
    this.loading = true;
    this.searchApi(searchDto)
      .pipe(finalize(() => this.loading = false))
      .subscribe(data => this.dataSubject.next(data));
  }
}
