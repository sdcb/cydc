import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DayOrdersApi {
  constructor(private http: HttpClient) {
  }

  dayOrders(days = 60) {
    return this.http.get<number[]>(`/api/report/dayorders?days=${days}`);
  }
}
