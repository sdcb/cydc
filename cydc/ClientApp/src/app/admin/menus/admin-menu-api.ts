import { PagedResult } from 'src/app/shared/utils/paged-query';
import { Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AdminMenuQuery, MenuDto, MenuCreateDto } from './admin-menu-dtos';

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

  saveTitle(id: number, title: string) {
    return this.http.post(`/api/adminMenu/saveTitle?menuId=${id}`, title, {
      responseType: "text"
    });
  }

  savePrice(id: number, priceToSave: string) {
    return this.http.post(`/api/adminMenu/savePrice?menuId=${id}&price=${priceToSave}`, {}, {
      responseType: "text"
    }).pipe(map(v => parseFloat(v)));
  }

  delete(id: number) {
    return this.http.post(`/api/adminMenu/delete?menuId=${id}`, {});
  }

  createMenu(dto: MenuCreateDto) {
    return this.http.post<number>(`/api/adminMenu/create`, dto);
  }
}
