import { Component } from '@angular/core';

import { GlobalLoadingService } from './services/global-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public globalLoading: GlobalLoadingService) {
  }
}
