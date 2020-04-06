import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

declare var M: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  _email: string;
  _password: string;

  constructor(private apiService: ApiService,
    private router: Router) { 
    this._email = undefined;
    this._password = undefined;
  }

  ngOnInit() {
  }

  login(form: NgForm) {
    this.apiService.postLogin(form.value)
      .subscribe(res => {
        if (res['auth']) {
          this.apiService.isAuthenticated = true;
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('token', res['token'] as string);
          sessionStorage.setItem('role', res['role'] as string);
          console.log(res['role']);
          this.router.navigate(['/']);
        }

      });
  }

  rememberMe(form: NgForm) {
    this.apiService.postRememberMe(form.value)
    .subscribe(res => {
      M.toast({ html: 'Recibiras un email con tu nueva contraseña en breve. Puede que este en spam.'});
      console.log(res);
    });
  }

}
