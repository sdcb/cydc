import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalLoadingService {
  promiseCount = 0;

  constructor() { }

  get visible() {
    return this.promiseCount > 0;
  }

  addPromise<T>(promise: Promise<T>) {
    this.promiseCount++;
    return promise.then(() => this.promiseCount--, () => this.promiseCount--);
  }

  addPromises(...promises: Promise<any>[]) {
    for(let promise of promises) {
      this.addPromise(promise);
    }
  }
}
