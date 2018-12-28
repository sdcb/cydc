import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { version } from "../../environments/version";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  source = "https://github.com/sdcb/cydc";

  constructor(public user: UserService) {
  }

  version() {
    return version.job + version.buildId;
  }
}
