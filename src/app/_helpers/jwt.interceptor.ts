import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AlertService } from '../_services';
import 'rxjs/add/operator/do';
import { MessageService } from 'primeng/components/common/messageservice';
import { environment } from '../../environments/environment';

let baseUrl = environment.urlApi;
console.log(environment);

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(public alertServcie: MessageService) {}
   

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `JWT ${currentUser.token}`
        },
        url: `${baseUrl}${request.url}`
      });
    } else {
      request = request.clone({url: `${baseUrl}${request.url}`});
    }

    return next.handle(request).do((event: HttpEvent<any>) => {}, (err: any) => {
      if (err instanceof HttpErrorResponse) {
       this.alertServcie.add({
          severity: "error",
          summary: "Помилка ",
          detail:  err.message || err.error.detail,
        });
       console.log(err);
      }
     });;
  }
}
