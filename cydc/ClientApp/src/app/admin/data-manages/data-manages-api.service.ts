import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocationDto, TasteDto } from 'src/app/foodOrder/food-order-api.service';

@Injectable({providedIn: 'root'})
export class DataManagesApiService {
  constructor(private http: HttpClient) { }

  getAllLocation() {
    return this.http.get<LocationManageDto[]>(`/api/dataManage/location`);
  }

  saveLocationName(locationId: number, name: string) {
    return this.http.post(`/api/dataManage/saveLocationName?locationId=${locationId}`, name, {
      responseType: "text"
    })
  }

  toggleLocationEnabled(locationId: number) {
    return this.http.post<boolean>(`/api/dataManage/toggleLocationEnabled?locationId=${locationId}`, {})
  }

  deleteLocation(locationId: number) {
    return this.http.post<boolean>(`/api/dataManage/deleteLocation?locationId=${locationId}`, {});
  }

  createLocation(name: string) {
    return this.http.post<number>(`/api/dataManage/createLocation`, name);
  }

  getAllTaste() {
    return this.http.get<TasteManageDto[]>(`/api/dataManage/taste`);
  }

  saveTasteName(tasteId: number, name: string) {
    return this.http.post(`/api/dataManage/saveTasteName?tasteId=${tasteId}`, name, {responseType: "text"});
  }

  toggleTasteEnabled(tasteId: number) {
    return this.http.post<boolean>(`/api/dataManage/toggleTasteEnabled?tasteId=${tasteId}`, {});
  }

  deleteTaste(tasteId: number) {
    return this.http.post(`/api/dataManage/deleteTaste?tasteId=${tasteId}`, {});
  }

  createTaste(name: string) {
    return this.http.post<number>(`/api/dataManage/createTaste`, name);
  }

  saveSiteNotification(notification: string) {
    return this.http.post(`/api/dataManage/saveSiteNotification`, notification);
  }
}

export type LocationManageDto = {
  foodOrderCount: number;
  enabled: boolean;
} & LocationDto;

export type TasteManageDto = {
  foodOrderCount: number;
  enabled: boolean;
} & TasteDto;
