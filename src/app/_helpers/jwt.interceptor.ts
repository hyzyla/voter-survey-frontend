import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AlertService, AuthenticationService } from '../_services';
import 'rxjs/add/operator/do';
import { MessageService } from 'primeng/components/common/messageservice';
import { environment } from '../../environments/environment';
import { routing } from '../app.routing'
import { Router } from '@angular/router';

let baseUrl = environment.urlApi;
console.log(environment);

function get_error_msg(error) {
  if (! error.status) {
    return JSON.stringify(error);
  }

  if (error.status >= 500 && error.status < 600) {
    return JSON.stringify(error.message);
  }

  if (error.status >= 400 && error.status < 500) {
    if (error.error && error.error.detail) { 
      if (error.error.detail instanceof Array) {
        return error.error.detail.join(", ")
      }
      return JSON.stringify(error.error.detail);
    } else if (error.error && error.error.attrib) { 
        if (error.error.attrib instanceof Array) {
          return error.error.attrib.join(", ")
        }
        return JSON.stringify(error.error.attrib);
    } else if (error.error) {
      return JSON.stringify(error.error);
    }
  }
  return ""
}

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    public alertServcie: MessageService,
    public authService: AuthenticationService,
    private router: Router
  ) {}
   

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

    return next.handle(request).do((event: HttpEvent<any>) => {}, (error: any) => {
      if (error instanceof HttpErrorResponse) {
       this.alertServcie.add({
          severity: "error",
          summary: "Помилка ",
          detail:  get_error_msg(error),
        });
      }
      if (get_error_msg(error).includes('Signature')) {
        //this.authService.logout();
        this.router.navigate(['/logout']);
      }
     });
     
  }
}
