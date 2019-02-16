import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ns-bluetooth',
  templateUrl: './bluetooth.component.html',
  styleUrls: ['./bluetooth.component.css'],
  moduleId: module.id,
})
export class BluetoothComponent implements OnInit {

  constructor(private router: Router) {
    console.log(this.router.url);
   }

  ngOnInit() {
  }

}
