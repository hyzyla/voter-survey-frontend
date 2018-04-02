import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpInterceptor,  } from '@angular/common/http';

import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService, AlertService, UserService } from './_services/index';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

import { TerritoryModule } from './territoriesManager/territoriesManager.component';
import { StatusesModule } from './statusesManager/statusesManager.component';
import { MainTableModule } from './table/table.module';
import { MainHeaderModule } from './header/header.component';
import { GrowlModule } from 'primeng/growl';
import { MessageService } from 'primeng/components/common/messageservice';

@NgModule({
  declarations: [
    HomeComponent,
    AlertComponent,
    LoginComponent,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    GrowlModule,
    routing,
    StatusesModule,
    MainTableModule,
    MainHeaderModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    HttpClientModule,
    MessageService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
