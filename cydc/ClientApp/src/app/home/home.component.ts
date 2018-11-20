import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private user: UserService) {
    
  }

  async ngOnInit() {
    let userStatus = await this.user.getUserStatus();
    console.log(userStatus);
  }
}
