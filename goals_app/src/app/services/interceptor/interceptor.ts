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

                    switch (event.status) {
                        case 400:
                            const message = 'Neteistingi duomenys.';
                            this._snackboxService.openSnackBar(message);
                            break;
                        case 200:
                            break;
                        case 204: {
                            // this._snackboxService.openSnackBar('Nėra turinio.');
                            break;
                        }

                        default:
                            const messageEnd = 'Statuso kodas: ' + event.status;
                            this._snackboxService.openSnackBar(messageEnd);
                            break;
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                // this._loadingBarService.changeLoadingState(false);
                if (error.status) {
                    if (error.status === 401) {
                        this._userService.logout();
                    } else {
                        switch (error.status) {
                            case 400:
                                const message = 'Neteistingi duomenys.';
                                this._snackboxService.openSnackBar(message);
                                break;
                            case 200:
                                break;
                            case 204: {
                                // this._snackboxService.openSnackBar('Nėra turinio.');
                                break;
                            }

                            default:
                                const messageEnd = 'Statuso kodas: ' + error.status;
                                this._snackboxService.openSnackBar(messageEnd);
                                break;
                        }
                    }
                } else {
                    const message = 'Nepasiekiami duomenys. Pabandykite dar kartą';
                    this._snackboxService.openSnackBar(message);
                }

                return throwError(error);
            }));
    }
}
