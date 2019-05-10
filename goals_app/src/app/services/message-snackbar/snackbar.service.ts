import { Injectable } from '@angular/core';
import { SnackBar } from "nativescript-snackbar";
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor() { }

  openSnackBar(message: string) {
    (new SnackBar()).simple(message)
  }
}
