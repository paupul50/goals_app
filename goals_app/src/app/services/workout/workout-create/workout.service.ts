import { SnackbarService } from '../../message-snackbar/snackbar.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutSessionHttpService } from '../workout-session/workout-session-http.service';
import { Polyline, Circle, Marker, Position, MapView } from 'nativescript-google-maps-sdk';
import { Color } from 'tns-core-modules/color/color';
import { getCurrentLocation } from 'nativescript-geolocation';
import { TabChangeService } from '../../tab-change/tab-change.service';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {
    isSessionStarted = false;
    currentSessionPoint = 0;
    locationString = '';
    locationCounter = 0;
    lastGeoTime = '';
    message = 'koordinates (getCoordsStatus)';
    interval: any;

    isCheckedIfLastWorkoutIsDone = false;

    workoutId: string;
    userLocation: Marker;
    map: MapView;

    routePoints: Circle[] = [];
    polyline: Polyline;
    // [latitude]="54.904053" [longitude]="23.949231" ąžuolynas
    centerCoordinates = {
        lat: 54.904053,
        lng: 23.949231
    };

    infoWindow: any;
    constructor(
        private _tabChangeService: TabChangeService,
        private _workoutSessionHttpService: WorkoutSessionHttpService,
        private _snackbarService: SnackbarService) { }


    // make circles green when loaded
    loadWorkoutProgress() {
        this.routePoints.forEach(routePoint => {
            if (routePoint.zIndex < this.currentSessionPoint) {
                routePoint.fillColor = new Color('green');
            }
        });
    }

    // clear routes when closing workout
    clearRoutePoints() {
        this.locationCounter = 0;
        this.routePoints = [];
        // this.isSessionStarted = false;
        this.workoutId = null;
        this.currentSessionPoint = 0;
        this.userLocation = null;
    }

    // to change currentLocation coordinates and if it's in the circle, change color of it
    changeUserLocation(location: Position) {
        this.userLocation.position = location;
        this.routePoints.forEach(routePoint => {
            if (this.arePointsNear(this.userLocation, routePoint, routePoint.radius / 1000) && this.currentSessionPoint === routePoint.zIndex) {
                console.log('new point reached!');
                // siust requesta su tasko id
                console.log(routePoint);
                this.updateWorkoutSession(routePoint);
            }
        });

    }

    // to update workout progress
    updateWorkoutSession(routePoint: any = {}) {
        this._workoutSessionHttpService.updateWorkoutSession(this.currentSessionPoint, routePoint.id, this.workoutId).subscribe((result: any) => {
            if (result.status === 0 || result.status === 2) {
                this.destroyInterval();
                this.clearRoutePoints();
                this.map.clear();
                this.isSessionStarted = false;
                // this._router.navigate(['workout']);
                this._tabChangeService.setNewTabValue({tabNumber: 0, id: null});
                this._snackbarService.openSnackBar('Treniruotė baigta');
            } else {
                routePoint.fillColor = new Color('green');
                this.currentSessionPoint++;
                this._snackbarService.openSnackBar('Taškas įveiktas');
            }
        });
    }

    // to start workout session
    startWorkoutSession() {
        this.startCheckingCurrentCoords();
        // siust request ir sukurimo metu sukurt workout
        this._workoutSessionHttpService.createWorkoutSession(this.workoutId).subscribe((result: any) => {
            this.currentSessionPoint = 1;
            this.isSessionStarted = true;
            console.log('create session', result);
        });
    }

    startCheckingCurrentCoords() {
        this.interval = setInterval(() => {
            this.checkGeoLocation();
        }, 3000);
    }

    private checkGeoLocation(): void {
        getCurrentLocation({})
            .then(location => {
                if (!this.userLocation) {
                    this.userLocation = new Marker();
                    this.userLocation.position = Position.positionFromLatLng(location.latitude, location.longitude);
                    this.map.addMarker(this.userLocation);
                } else {
                    this.userLocation.position = Position.positionFromLatLng(location.latitude, location.longitude);
                }
                this.locationString = "Location received: " + location.latitude + ' ' + location.longitude + ': ' + this.locationCounter++;
                this.lastGeoTime = ' laikas:' + new Date().toTimeString();
            }).catch(error => {
                alert("Location error received: " + error);
            });
    }

    destroyInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }


    // to check if the coordinate is inside a circle
    private arePointsNear(checkPoint: Marker, centerPoint: Circle, km): boolean {
        const ky = 40000 / 360;
        const kx = Math.cos(Math.PI * centerPoint.center.latitude / 180.0) * ky;
        const dx = Math.abs(centerPoint.center.longitude - checkPoint.position.longitude) * kx;
        const dy = Math.abs(centerPoint.center.latitude - checkPoint.position.latitude) * ky;
        // console.log('dydis', Math.sqrt(dx * dx + dy * dy));
        // console.log('km', km);
        return Math.sqrt(dx * dx + dy * dy) <= km;
    }
}
