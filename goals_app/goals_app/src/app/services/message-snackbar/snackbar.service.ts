import { Injectable } from '@angular/core';
import { SnackBar } from "nativescript-snackbar";
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
//   private duration = 2000;

  constructor() { }

  openSnackBar(message: string) {
    (new SnackBar()).simple(message)
    // this.snackBar.open(message, null, {
    //   duration: this.duration,
    // });
  }
}
