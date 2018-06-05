import { Observable } from 'rxjs/Observable';
import { AUTH_CONFIG } from './auth.config';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../core/models/user.model';

@Injectable()
export class Oauth2Service {

  constructor(private http: HttpClient) { }

  initPasswordFlow$(email: string, password: string): Observable<any> {
    const params = new HttpParams()
      .append('username', email)
      .append('password', password)
      .append('grant_type', 'password')
      .append('scope', AUTH_CONFIG.SCOPE);
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Basic ' + btoa(`${AUTH_CONFIG.CLIENT_ID}:browserSecret`)
    });
    const options = { headers: headers, params: params };
    return this.http.post('http://localhost:5000/auth/oauth/token', {}, options);
  }

  userInfo$(accessToken): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + accessToken
    });
    const options = { headers: headers };
    return this.http.get('http://localhost:5000/auth/users/current', options);
  }

  createUser$(email: string, password: string): Observable<any> {
    const user = new UserModel(email, password);
    const headers = new HttpHeaders({
      'Content-type': 'application/json'
    });
    const options = { headers: headers };
    return this.http.post('http://localhost:5000/auth/users', user, options);
  }
}
