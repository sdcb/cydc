import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ScreenSizeService } from '../services/screen-size.service';

@Injectable({
  providedIn: 'root'
})
export class FoodOrderApiService {
  constructor(
    private http: HttpClient,
    private size: ScreenSizeService) { }

  getSiteNotification() {
    return this.http.get("/api/foodOrder/siteNotification", { responseType: "text" });
  }

  getTodayMenus() {
    return this.http.get<FoodOrderMenu[]>("/api/info/menu");
  }

  getAllLocation() {
    return this.http.get<LocationDto[]>("/api/info/address");
  }

  getAllTaste() {
    return this.http.get<TasteDto[]>("/api/info/taste");
  }

  create(dto: OrderCreateDto) {
    return this.http.post<void>("/api/foodOrder/create", dto);
  }

  getMyFoodOrder() {
    return this.http.get<FoodOrderItem[]>("/api/foodOrder/my");
  }

  getMyBalance() {
    return this.http.get<number>("/api/foodOrder/MyBalance");
  }

  searchPersonNames(name: string) {
    if (!name || name === "") return of([]);
    return this.http.get<string[]>(`/api/foodOrder/searchName?name=${encodeURIComponent(name)}`)
  }

  saveComment(orderId: number, comment: string) {
    return this.http.post(`/api/foodOrder/saveComment?orderId=${orderId}`, comment, {
      responseType: "text"
    });
  }

  foodOrderColumns() {
    if (this.size.md)
      return ["orderTime", "menu", "comment", "isPayed"];
    else if (this.size.lg)
      return ["id", "orderTime", "menu", "comment", "price", "isPayed"];
    else
      return ["id", "userName", "orderTime", "menu", "comment", "price", "isPayed"];
  };

  foodOrderColumnsForAdmin() {
    if (this.size.md)
      return ["userName", "orderTime", "menu", "comment", "action"];
    else if (this.size.lg)
      return ["userName", "orderTime", "menu", "comment", "price", "isPayed", "action"];
    else
      return ["userName", "location", "taste", "orderTime", "menu", "location", "comment", "price", "isPayed", "action"];
  };

  getMyLastTasteId() {
    return this.http.get<number>(`/api/foodOrder/myLastTaste`);
  }

  getMyLastLocationId() {
    return this.http.get<number>(`/api/foodOrder/myLastLocation`);
  }
}

export type LocationDto = {
  id: number;
  location: string;
}

export type TasteDto = {
  id: number;
  name: string;
}

export type FoodOrderMenu = {
  id: number;
  title: string;
  price: string;
  details: string;
}

export type OrderCreateDto = {
  addressId: number;
  tasteId: number;
  menuId: number;
  isMe: boolean;
  otherPersonName: string | undefined;
  comment: string | undefined;
}

export interface FoodOrderItem {
  id: number;
  userName: string;
  orderTime: string;
  menu: string;
  details: string;
  price: number;
  comment: string;
  isPayed: boolean;
}
