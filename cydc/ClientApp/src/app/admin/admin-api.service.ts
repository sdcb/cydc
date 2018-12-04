import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  constructor(private http: HttpClient) { }

  getUsers(query: AdminUserQuery, skip: number, take: number) {
    return this.http.get<AdminUserDto[]>(`/api/admin/users?skip=${skip}&take=${take}&operator=${query.operator}&name=${encodeURIComponent(query.name)}`);
  }
}

export class AdminUserQuery {
  name!: string;
  operator!: BalanceOperator;
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

  constructor(private searchApi: (searchDto: S, skip: number, take: number) => Observable<T[]>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.dataSubject.complete();
  }

  loadData(searchDto: S, page = 1, pageSize = 12) {
    this.loading = true;
    this.searchApi(searchDto, (page - 1) * pageSize, pageSize)
      .pipe(finalize(() => this.loading = false))
      .subscribe(data => this.dataSubject.next(data));
  }
}
