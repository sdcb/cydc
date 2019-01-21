import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { version } from "../../environments/version";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(public user: UserService) {
  }

  version() {
    return version.job + "-" + version.buildId;
  }

  rv() {
    return version.rv;
  }

  source() {
    return version.source;
  }
}
