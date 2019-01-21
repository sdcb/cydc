import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DayOrdersApi {
  constructor(private http: HttpClient) {
  }

  dayOrders(days: number) {
    return this.http.get<ReportDataItem[]>(`/api/report/dayOrders?days=${days}`);
  }

  hourOrders(days: number) {
    return this.http.get<ReportDataItem[]>(`/api/report/hourOrders?days=${days}`);
  }

  tasteOrders(days: number) {
    return this.http.get<ReportDataItem[]>(`/api/report/tasteOrders?days=${days}`);
  }
}

export interface ReportDataItem {
  name: string;
  value: number;
}
