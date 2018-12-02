import { Component } from '@angular/core';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GlobalLoadingService } from './services/global-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public globalLoading: GlobalLoadingService) {
    library.add(faSpinner);
  }
}
