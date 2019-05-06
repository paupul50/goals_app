import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { WorkoutCreateService } from '../services/workout/workout-create/workout-create.service';
import { WorkoutService } from '../services/workout/workout/workout.service';
import { MapView, Marker, Position, Circle, Polyline } from 'nativescript-google-maps-sdk';
import { enableLocationRequest, isEnabled, getCurrentLocation } from "nativescript-geolocation";

import { registerElement } from "nativescript-angular/element-registry";
import { Color } from 'tns-core-modules/color/color';
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);
@Component({
    selector: 'ns-workout-session',
    templateUrl: './workout-session.component.html',
    styleUrls: ['./workout-session.component.css'],
    moduleId: module.id,
})
export class WorkoutSessionComponent implements OnInit, OnChanges {
    @ViewChild("MapView") mapView: ElementRef;
    @Input() workoutId: string;
    locationString: string;
    tempIndex = 0;
    marker = new Marker();

    constructor(public workoutCreateService: WorkoutCreateService,
        private _workoutService: WorkoutService) {

    }
    map: MapView;

    imitateLocation(event: any) {
        if (this.workoutCreateService.isWorkoutSession && this.workoutCreateService.currentSessionPoint > 0) {
            this.workoutCreateService.changeUserLocation(event.coords);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const workoutId: SimpleChange = changes.workoutId;
        // console.log('prev value: ', workoutId.previousValue);
        // console.log('got name: ', workoutId.currentValue);
        if (workoutId.currentValue != null) {
            // getCurrentLocation({
            //     timeout: 1000
            //  })
            //     .then(location => {
            //         console.log("Location received: " + location);
            //         this.workoutCreateService.userLocation = {
            //             lat: location.latitude,
            //             lng: location.longitude
            //         }
            //     }).catch(error => {
            //         console.log("Location error received: " + error);
            //         alert("Location error received: " + error);
            //     });
            this.workoutCreateService.clearRoutePoints();
            this.map.clear();
            this.marker.position = Position.positionFromLatLng(54.904053, 23.949231);
            this.marker.zIndex = 100;
            this.map.addMarker(this.marker);
            this._workoutService.getUserWorkout(this.workoutId).subscribe((workout: any) => {
                // console.log('workout', workout);
                // this.isWorkoutLoaded = true;
                this.workoutCreateService.routePoints = workout.workoutWithRoutePoints;
                this.workoutCreateService.isWorkoutSession = true;
                this.workoutCreateService.workoutId = this.workoutId;
                let pl = new Polyline();
                this.workoutCreateService.routePoints.forEach(route => {
                    let rp = new Circle();



                    // lat: this.centerCoordinates.lat,
                    // lng: this.centerCoordinates.lng,
                    // radius: 50,
                    // fillColour: 'blue',
                    // circleDraggable: true,
                    // editable: true,
                    // index: this.routePoints.length + 1
                    rp.clickable = route.clickable;
                    rp.center = Position.positionFromLatLng(route.lat, route.lng);
                    pl.addPoint(rp.center);
                    rp.radius = route.radius;
                    let color = new Color(route.fillColour)
                    console.log('colour:', route.fillColour)
                    console.log('color:', color)
                    rp.fillColor = color;
                    rp.zIndex = route.index;
                    this.map.addCircle(rp);
                });
                this.map.addPolyline(pl);
                // console.log('sessionPoint', this.workoutCreateService.currentSessionPoint);
                if (this.workoutCreateService.currentSessionPoint > 1) {
                    this.workoutCreateService.isSessionStarted = true;
                    this.workoutCreateService.loadWorkoutProgress();
                }
            });

        }
    }
    //Map events
    onMapReady = (event) => {
        this.map = event.object;
    };

    onTap() {
        console.log(this.workoutId);
        this.getPosition();
        this.mapView.nativeElement

        // isEnabled().then(function (isLocationEnabled) {
        //     let message = "Location services are not available";
        //     if (isLocationEnabled) {
        //         message = "Location services are available";
        //     }
        //     alert(message);
        // }, function (e) {
        //     console.log("Location error received: " + (e.message || e));
        // });
    }

    getPosition() {
        getCurrentLocation({
            timeout: 1000
        })
            .then(location => {
                this.locationString = "Location received: " + location.latitude + ' ' + location.longitude + ': ' + this.tempIndex++;
                this.workoutCreateService.userLocation = {
                    lat: location.latitude,
                    lng: location.longitude
                }
                this.marker.position = Position.positionFromLatLng(location.latitude, location.longitude);
            }).catch(error => {
                this.locationString = "Location error received: " + error;
                alert("Location error received: " + error);
            });
    }
    ngOnInit() {
        console.log('init')
    }

}
