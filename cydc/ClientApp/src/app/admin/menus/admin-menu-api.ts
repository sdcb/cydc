import { SortedPagedQuery, SortedPagedDto, unwrapNumber, PagedResult } from 'src/app/shared/utils/paged-query';
import { ScreenSizeService } from 'src/app/services/screen-size.service';
import { Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

export interface MenuQueryDto extends SortedPagedDto {
  details: string;
  price: string;
  startTime: string;
  endTime: string;
}

export class AdminMenuQuery extends SortedPagedQuery<MenuQueryDto> {
  details: string = "";
  price: number | undefined;
  startTime: string | undefined = "";
  endTime: string | undefined;

  toDto(): MenuQueryDto {
    let o = <MenuQueryDto>super.toDto();
    if (this.details !== "") o.details = this.details;
    if (this.price !== undefined && this.price !== null) o.price = this.price.toString();
    if (this.startTime !== "" && this.startTime !== undefined) o.startTime = new Date(this.startTime).toISOString();
    if (this.endTime !== "" && this.endTime !== undefined) o.endTime = new Date(this.endTime).toISOString();    
    return o;
  }

  replaceWith(p: Partial<MenuQueryDto>) {
    super.replaceWith(p);
    // todo: menu search items
    this.details = p.details || "";
    this.price = unwrapNumber(p.price);
    this.startTime = p.startTime;
    this.endTime = p.endTime;
  }
}

export function menuColumns(size: ScreenSizeService) {
  if (size.md) return ["createTime", "details", "price", "orderCount", "enabled"];
  return ["id", "createTime", "name", "details", "price", "orderCount", "enabled"];
}

export type MenuDto = {
  id: number;
  createTime: number;
  name: string;
  details: string;
  price: number;
  enabled: boolean;
  orderCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminMenuApi {
  constructor(private http: HttpClient) {
  }

  getMenus(query: AdminMenuQuery) {
    return this.http.get<PagedResult<MenuDto>>(`/api/adminMenu/menus`, {
      params: <Params>query.toDto(), 
    });
  }

  toggleStatus(menuId: number) {
    return this.http.post<boolean>(`/api/adminMenu/toggleStatus?menuId=${menuId}`, {});
  }

  saveContent(id: number, detailsToSave: string) {
    return this.http.post(`/api/adminMenu/saveContent?menuId=${id}`, detailsToSave, {
      responseType: "text"
    });
  }

  savePrice(id: number, priceToSave: string) {
    return this.http.post(`/api/adminMenu/savePrice?menuId=${id}&price=${priceToSave}`, {}, {
      responseType: "text"
    }).pipe(map(v => parseFloat(v)));
  }
}
