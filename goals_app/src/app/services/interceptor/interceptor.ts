import { UserService } from '../user/user.service';
// import { LoadingBarService } from './../loading-bar/loading-bar.service';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SnackbarService } from '../message-snackbar/snackbar.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private _snackboxService: SnackbarService,
    private _userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this._loadingBarService.changeLoadingState(true);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        //   this._loadingBarService.changeLoadingState(false);
          if (event.status !== 200) {
            const message = 'Statuso kodas: ' + event.status;
            this._snackboxService.openSnackBar(message);
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // this._loadingBarService.changeLoadingState(false);
        if (error.status === 401) {
          this._userService.logout();
        } else {
          const message = 'Klaidos kodas: ' + error.status;
          this._snackboxService.openSnackBar(message);
        }
        return throwError(error);
      }));
  }
}
