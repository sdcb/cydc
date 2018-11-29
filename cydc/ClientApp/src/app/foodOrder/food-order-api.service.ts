import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodOrderApiService {
  constructor(private http: HttpClient) { }

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
