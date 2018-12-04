import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodOrderApiService {
  constructor(
    private http: HttpClient) { }

  getSiteNotification() {
    return this.http.get("/api/foodOrder/siteNotification", { responseType: "text" });
  }

  getTodayMenus() {
    return this.http.get<FoodOrderMenu[]>("/api/info/menu");
  }

  getAllAddress() {
    return this.http.get<OrderAddress[]>("/api/info/address");
  }

  getAllTaste() {
    return this.http.get<FoodTaste[]>("/api/info/taste");
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
}

export type OrderAddress = {
  id: number;
  name: string;
}

export type FoodTaste = {
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
  price: number;
  comment: string;
  isPayed: boolean;
}
