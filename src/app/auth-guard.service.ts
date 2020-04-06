import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  

  constructor(public apiService: ApiService, public router: Router) {
    
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (route.routeConfig.path === 'logout') {
      sessionStorage.clear()
      this.apiService.isAuthenticated = false;
      return true;
    }

    if (route.routeConfig.path === 'login') {
      if (!(sessionStorage.getItem('isAuthenticated') === 'true')) {
        return true;
      } else {
        return false;
      }
    }
    if (!(sessionStorage.getItem('isAuthenticated') === 'true')) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
