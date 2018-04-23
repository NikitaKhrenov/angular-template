import { FilterSortService } from './core/filter-sort.service';
import { ApiService } from './core/api.service';
import { Oauth2Service } from './auth/oauth2.service';
import { AuthService } from './auth/auth.service';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { LoadingComponent } from './core/loading.component';
import { DatePipe } from '@angular/common';
import { UtilsService } from './core/utils.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CallbackComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    Title,
    AuthService,
    Oauth2Service,
    ApiService,
    DatePipe,
    UtilsService,
    FilterSortService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
