import { Injectable } from '@angular/core';
import { SnackBar } from "nativescript-snackbar";
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor() { }

  openSnackBar(message: string): void {
    (new SnackBar()).simple(message)
  }
}
