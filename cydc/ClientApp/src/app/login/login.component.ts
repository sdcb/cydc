import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SecurityService } from './security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    userName: new FormControl(),
    password: new FormControl(),
    rememberMe: new FormControl(),
  });

  requesting = false;

  constructor(
    private securityService: SecurityService,
    private router: Router) { }

  ngOnInit() {
  }

  signIn() {
    this.requesting = true;

    this.securityService.login(this.loginForm.value)
      .subscribe(resp => {
        if (resp.isAuthenticated) {
          this.router.navigateByUrl('/');
        }

        this.requesting = false;
      });
  }
}
