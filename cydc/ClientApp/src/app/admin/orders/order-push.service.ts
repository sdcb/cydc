import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection, HubConnectionState } from "@aspnet/signalr";
import { Subject, of, Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { FoodOrderDto } from './admin-user-dtos';

@Injectable({
  providedIn: "root"
})
export class OrderPushService {
  private subject = new Subject<number>();
  private hubConnection: HubConnection;
  private subscriptionCount = 0;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("/hubs/newOrder")
      .build();
    this.hubConnection.on("onNewOrder", orderId => {
      this.subject.next(orderId);
    });
    this.hubConnection.onclose(async () => {
      if (this.subscriptionCount !== 0) {
        await of(timeout(1000)).toPromise();
        if (this.subscriptionCount !== 0) {
          await this.hubConnection.start();
        }
      }
    });
  }

  async subscribe(next: (foodOrderId: number) => void) {
    if (this.hubConnection.state !== HubConnectionState.Connected) {
      await this.hubConnection.start();
    }

    this.subscriptionCount += 1;

    const subscription = this.subject.subscribe(v => next(v));
    return new Subscription(() => {
      subscription.unsubscribe();
      this.subscriptionCount -= 1;
      if (this.subscriptionCount === 0) {
        this.hubConnection.stop();
      }
    });
  }
}
