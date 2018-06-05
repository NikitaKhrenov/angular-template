import { UtilsService } from './../../core/utils.service';
import { ApiService } from './../../core/api.service';
import { AuthService } from './../../auth/auth.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  pageTitle = 'Login';

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private api: ApiService,
    private utils: UtilsService,
    private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

}
