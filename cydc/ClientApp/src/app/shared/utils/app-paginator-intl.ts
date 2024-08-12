import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { Injectable } from "@angular/core";

@Injectable()
export class AppPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.nextPageLabel = "下一页";
    this.previousPageLabel = "上一页";
    this.itemsPerPageLabel = "每页条数:";
    this.firstPageLabel = "第一页";
    this.lastPageLabel = "最后一页";
  }
}
