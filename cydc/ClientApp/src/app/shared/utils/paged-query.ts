import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { map, finalize } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

export interface PagedDto {
  page: string;
  pageSize: string;
}

export class PagedResult<T> {
  pagedData: T[] = [];
  totalCount = 0;
}

export class PagedQuery {
  pageIndex!: number;
  pageSize!: number;

  constructor() {
    this.resetPager();
  }

  page() { return this.pageIndex + 1; }

  replaceWith(p: Partial<PagedDto>) {
    this.pageIndex = p.page ? parseInt(p.page) - 1 : 0;
    this.pageSize = parseInt(p.pageSize!) || 12;
  }

  toDto(): PagedDto {
    const o = <PagedDto>{};
    if (this.pageIndex !== 0) { o.page = this.page().toString(); }
    if (this.pageSize !== 12) { o.pageSize = this.pageSize.toString(); }
    return o;
  }

  resetPager() {
    this.pageIndex = 0;
    this.pageSize = 12;
  }
}

export interface SortedPagedDto extends PagedDto {
  sort: string;
  direction: string;
}

export class SortedPagedQuery extends PagedQuery {
  sort: string | undefined;
  direction: string | undefined;

  applySort(s: Sort) {
    if (s.direction === '') {
      this.sort = undefined;
      this.direction = undefined;
    } else {
      this.sort = s.active;
      this.direction = s.direction;
    }
  }

  replaceWith(p: Partial<SortedPagedDto>) {
    super.replaceWith(p);
    if (p.sort !== undefined) { this.sort = p.sort; }
    if (p.direction) { this.direction = p.direction; }
  }

  toDto(): SortedPagedDto {
    const o = <SortedPagedDto>super.toDto();
    if (this.sort !== undefined) { o.sort = this.sort; }
    if (this.direction !== undefined) { o.direction = this.direction; }
    return o;
  }

  resetPager() {
    this.pageIndex = 0;
  }
}

export class ApiDataSource<TData> extends DataSource<TData> {
  dataSubject = new BehaviorSubject(new PagedResult<TData>());
  dataCount = 0;
  items: TData[] = [];
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
        this.items = data.pagedData;
        this.dataCount = data.totalCount;
        this.dataSubject.next(data);
      });
  }
}

export function unwrapNumber(strNumber: string | undefined) {
  if (strNumber === undefined) { return undefined; }
  return parseFloat(strNumber);
}

export function unwrapBoolean(boolStr: string | undefined) {
  if (boolStr === undefined) { return undefined; }
  return boolStr === 'true';
}
