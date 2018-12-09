import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { map, finalize } from 'rxjs/operators';

export interface PagedDto {
  page: string;
  pageSize: string;
}

export class PagedResult<T> {
  pagedData: T[] = [];
  totalCount: number = 0;
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
