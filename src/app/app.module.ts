import { ApiService } from './core/api.service';
import { Oauth2Service } from './auth/oauth2.service';
import { AuthService } from './auth/auth.service';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { LoginComponent } from './pages/login/login.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { LoadingComponent } from './core/loading.component';
import { UtilsService } from './core/utils.service';
import { ListComponent } from './widgets/accordion/list/list.component';
import { ItemComponent } from './widgets/accordion/item/item.component';
import { AccordionComponent } from './widgets/accordion/accordion.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CallbackComponent,
    LoginComponent,
    UserFormComponent,
    LoadingComponent,
    ListComponent,
    ItemComponent,
    AccordionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    Title,
    AuthService,
    Oauth2Service,
    ApiService,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
