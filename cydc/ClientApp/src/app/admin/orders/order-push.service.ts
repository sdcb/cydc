import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection, HubConnectionState } from "@aspnet/signalr";
import { Observable, Subject, of } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class OrderPushService {
  subject = new Subject<number>();
  hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("/hubs/newOrder")
      .build();
    this.hubConnection.on("onNewOrder", orderId => {
      this.subject.next(orderId);
    });
    this.hubConnection.onclose(async () => {
      await of(timeout(1000)).toPromise();
      this.start();
    });
  }

  async start() {
    if (this.hubConnection.state !== HubConnectionState.Connected) {
      await this.hubConnection.start();
    }
  }

  onNewOrder(): Observable<number> {
    return this.subject;
  }
}
