import { Oauth2Service } from './oauth2.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ENV } from '../core/env.config';

@Injectable()
export class AuthService {

  userProfile: any;
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  isAdmin: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    private oauth: Oauth2Service) {
    // If authenticated, set local profile property
    // and update login status subject.
    // If not authenticated but there are still items
    // in localStorage, log out.
    const lsProfile = localStorage.getItem('profile');

    if (this.tokenValid) {
      this.userProfile = JSON.parse(lsProfile);
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.setLoggedIn(true);
    } else if (!this.tokenValid && lsProfile) {
      this.logout();
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    this.oauth.initPasswordFlow('email@email3', 'pass')
      .subscribe(
        authResult => {
          this._getProfile(authResult);
        },
        err => {
          console.error(`Error authenticating: ${err.error}`);
        }
      );
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    /*this._auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this._getProfile(authResult);
      } else if (err) {
        console.error(`Error authenticating: ${err.error}`);
      }
      this.router.navigate(['/']);
    });*/
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this.oauth.userInfo(authResult.access_token)
      .subscribe(
        profile => {
          this._setSession(authResult, profile);
        },
        err => {
          console.error(`Error authenticating: ${err.error}`);
        }
      );
  }

  private _setSession(authResult, profile) {
    // Save session data and update login status subject
    const expiresAt = JSON.stringify((authResult.expires_in * 1000) + Date.now());
    // Set tokens and expiration in localStorage and props
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.userProfile = profile;
    this.isAdmin = this._checkAdmin(profile);
    localStorage.setItem('isAdmin', this.isAdmin.toString());
    // Update login status in loggedIn$ stream
    this.setLoggedIn(true);
  }

  private _checkAdmin(profile) {
    // Check if the user has admin role
    const roles = profile['roles'] || [];
    return roles.indexOf('admin') > -1;
  }

  logout() {
    // Ensure all auth items removed from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('authRedirect');
    // Reset local properties, update loggedIn$ stream
    this.userProfile = undefined;
    this.isAdmin = undefined;
    this.setLoggedIn(false);
    // Return to homepage
    this.router.navigate(['/']);
  }

  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

}
