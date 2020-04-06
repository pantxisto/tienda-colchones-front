import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly URL_API ='http://localhost:3000';
  readonly URL_API_AUTH ='http://localhost:3000/auth';

  isAuthenticated: boolean;
  
  constructor(private http: HttpClient) { 
    this.isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true' ? true : false;
  }

  postLogin(User) {
    return this.http.post(this.URL_API_AUTH + '/signin', User);
  }

  postRememberMe(User) {
    return this.http.post(this.URL_API_AUTH + '/signremember', User);
  }

  getFavoriteProducts(actualUrl, pageIndex): Observable<any> {
    if (actualUrl === '/') {
      return this.http.get(this.URL_API + '/' + pageIndex,{
        headers: new HttpHeaders({
          "authorization": sessionStorage.getItem('token')
        })
      });
    } else if (actualUrl === '/colchones') {
      return this.http.get(this.URL_API + '/colchones/' + pageIndex,{
        headers: new HttpHeaders({
          "authorization": sessionStorage.getItem('token')
        })
      });
    } else if (actualUrl === '/somieres') {
      return this.http.get(this.URL_API + '/somieres/' + pageIndex,{
        headers: new HttpHeaders({
          "authorization": sessionStorage.getItem('token')
        })
      });
    }
    
  }

  deleteProduct(_id) {
    return this.http.delete(this.URL_API + '/product/' + _id,{
      headers: new HttpHeaders({
        "authorization": sessionStorage.getItem('token')
      })
    });
  }

  postProduct(User) {
    return this.http.post(this.URL_API + '/product', User,{
      headers: new HttpHeaders({
        "authorization": sessionStorage.getItem('token')
      })
    });
  }

  getProduct(_id) {
    return this.http.get(this.URL_API + '/product/' + _id,{
      headers: new HttpHeaders({
        "authorization": sessionStorage.getItem('token')
      })
    });
  }

  putProduct(_id, User) {
    return this.http.put(this.URL_API + '/product/' + _id, User,{
      headers: new HttpHeaders({
        "authorization": sessionStorage.getItem('token')
      })
    });
  }

}
