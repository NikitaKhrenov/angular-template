import { Observable } from 'rxjs/Observable';
import { Oauth2Service } from './oauth2.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ENV } from '../core/env.config';
import { UserModel } from '../core/models/user.model';

import { of as observableOf } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { mergeMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {

  userProfile: any;
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  isAdmin: boolean;

  refreshSub: any;

  constructor(
    private router: Router,
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

  login$(email: string, password: string): Observable<any> {
    const loginSub = new Subject();
    loginSub.subscribe(
      authResult => {
        this._getProfile(authResult);
      },
      err => {
        console.error(err);
      }
    );
    this.oauth.initPasswordFlow$(email, password).subscribe(loginSub);
    return loginSub;
  }

  signup$(email: string, password: string): Observable<any> {
    const signupSub = new Subject();
    signupSub.subscribe(
      authResult => {
        this.login$(email, password);
      },
      err => {
        console.error(err);
      }
    );
    this.oauth.createUser$(email, password).subscribe(signupSub);
    return signupSub;
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

  _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this.oauth.userInfo$(authResult.access_token)
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
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.userProfile = profile;
    this.isAdmin = this._checkAdmin(profile);
    localStorage.setItem('isAdmin', this.isAdmin.toString());
    // Update login status in loggedIn$ stream
    this.setLoggedIn(true);
    this.scheduleRenewal();
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
    localStorage.removeItem('isAdmin');

    this.unscheduleRenewal();
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

  renewToken() {
    this.oauth.refreshToken$().subscribe(
      authResult => {
        this._getProfile(authResult);
      },
      err => {
        console.log(err);
        this.logout();
      }
    );
  }

  scheduleRenewal() {
    if (!this.loggedIn) {
      return;
    }
    this.unscheduleRenewal();

    const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));

    const expiresIn$ = observableOf(expiresAt).pipe(
      mergeMap(
        // tslint:disable-next-line:no-shadowed-variable
        expiresAt => {
          const now = Date.now();
          // Use timer to track delay until expiration
          // to run the refresh at the proper time
          return timer(expiresAt - now);
        }
      )
    );

    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
    this.refreshSub = expiresIn$.subscribe(
      () => {
        this.renewToken();
      }
    );
  }

  public unscheduleRenewal() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

}
