import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as Bluetooth from "nativescript-bluetooth";

@Component({
  selector: "ns-bluetooth",
  templateUrl: "./bluetooth.component.html",
  styleUrls: ["./bluetooth.component.css"],
  moduleId: module.id
})
export class BluetoothComponent implements OnInit {
  peripherals = [];
  isLoading = false;
  constructor(private router: Router) {
    console.log(this.router.url);
  }

  ngOnInit() {}

  onBluetoothButtonTap(): void {
    // Bluetooth.isBluetoothEnabled().then((enabled: boolean) => {
    //   if (enabled) {
    //   }
    // });
    console.log("viskas ok");
    this.peripherals = [];
    this.isLoading = true;
    const scanningOptions = {
      serviceUUIDs: [], // pass an empty array to scan for all services
      seconds: 1, // passing in seconds makes the plugin stop scanning after <seconds> seconds
      skipPermissionCheck: false,
      onDiscovered: (peripheral: any) => {
        this.peripherals.push(peripheral);
      }
    };
    Bluetooth.startScanning(scanningOptions).then(() => {
      console.log("scanning complete");
      this.isLoading = false;
    });
  }

  onPeripheralTap(peripheral: any): void {
    console.log(peripheral);
    let services = [];
    const connectOptions = {
      UUID: peripheral.UUID,
      onConnected: function(peripheral) {
        peripheral.services.forEach(function(service) {
          if (service.UUID == "fee0") {
            
            service.characteristics.forEach(characteristic => {
              
              if (characteristic.properties.read == true && characteristic.UUID=="00000006-0000-3512-2118-0009af100700") {

                // JS: read error: Failed to set client characteristic read for 0000fede-0000-1000-8000-00805f9b34fb
                // nieko
                // JS: read error: Failed to set client characteristic read for 0000fedf-0000-1000-8000-00805f9b34fb
                // nieko
                // JS: read error: Failed to set client characteristic read for 0000fed0-0000-1000-8000-00805f9b34fb
                // nieko
                // JS: read error: Failed to set client characteristic read for 0000fed1-0000-1000-8000-00805f9b34fb
                // nieko 
                // JS: read error: Failed to set client characteristic read for 0000fed2-0000-1000-8000-00805f9b34fb
                // nieko 
                // JS: read error: Failed to set client characteristic read for 0000fed3-0000-1000-8000-00805f9b34fb
                // nieko 
                // JS: read error: Failed to set client characteristic read for 0000fec1-0000-3512-2118-0009af100700
                // null




                // JS: read error: Failed to set client characteristic read for 00002a04-0000-1000-8000-00805f9b34fb
                //nieko
                // JS: read error: Failed to set client characteristic read for 00000006-0000-3512-2118-0009af100700
                // 15,75,0,227,7,1,9,7,10,8,12,227,7,2,3,2,31,13,12,100
                // 15,75,0,227,7,1,9,7,10,8,12,227,7,2,3,2,31,13,12,100
                
                // JS: read error: Failed to set client characteristic read for 00000007-0000-3512-2118-0009af100700
                // null
                // JS: read error: Failed to set client characteristic read for 00000020-0000-3512-2118-0009af100700
                // 3
                console.log(characteristic.name);
                Bluetooth.read({
                  peripheralUUID: peripheral.UUID,
                  serviceUUID: service.UUID,
                  characteristicUUID: characteristic.UUID
                }).then(
                  function(result) {
                    console.log('------------------------------------------')
                    console.log(characteristic.name);
                    console.log(result);
                    console.log(result.value);
                    console.log(result.valueRaw);
                    console.log(result.value[0]);
                    // fi. a heartrate monitor value (Uint8) can be retrieved like this:
                    var data = new Uint8Array(result.value);
                    console.log(data);
                    console.log(data[0]);
                  },
                  function(err) {
                    console.log("read error: " + err);
                  }
                );
              }
            });
          }
        });

        // // the peripheral object now has a list of available services:
        // peripheral.services.forEach(function(service) {
        //   services.push(service);
        // });
        // console.log(services)
      },
      onDisconnected: function(peripheral) {
        console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
      }
    };
    Bluetooth.connect(connectOptions);
  }
}
