import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalLoadingService {
  promiseCount = 0;

  constructor() { }

  get visible() {
    return this.promiseCount > 0;
  }

  wrap<T>(promise: Promise<T>) {
    this.promiseCount++;
    promise.then(() => this.promiseCount--, () => this.promiseCount--);
    return promise;
  }

  wrapAll(...promises: Promise<any>[]) {
    for(let promise of promises) {
      this.wrap(promise);
    }
  }
}
