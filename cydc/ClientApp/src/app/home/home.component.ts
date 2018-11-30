import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  source = "https://github.com/sdcb/cydc";

  constructor(public user: UserService) {
  }
}
