import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(private toaster: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token != null) {
      request = request.clone({
        setHeaders: {
            Authorization: 'Bearer ' + token.replace(/\"/g, ""),
        },
      });
    }
    return next.handle(request)
    .pipe(catchError(err => {
        if ([401, 403].includes(err.status)) {
            localStorage.removeItem('token');
            localStorage.removeItem('permissions');
            localStorage.removeItem('adminLogin');
            window.location.href = ('auth/login');
        }

        if(err.error.validationErrors) {
          const error = err.error.validationErrors;
          error.map((item) => {
              this.toaster.error(item.reason);
          })
          return throwError(error);
        }
        else if(err.error.detail) {
            const error = err.error;
            this.toaster.error(err.error.detail)
            return throwError(error);
        }
        else if(err.error.title) {
          const error = err.error;
          this.toaster.error(err.error.title)
          return throwError(error);
        }
        else {
          const error = err.error;
          this.toaster.error('Unknown Error')
          return throwError(error);
        }
    }));
  }

}