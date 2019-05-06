import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutSessionService } from '../workout-session/workout-session.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutCreateService { // susikeist pavadinimais su workoutservice

  isWorkoutSession = false;
  isSessionStarted = false;
  currentSessionPoint = 0;
  message = 'koordinates (getCoordsStatus)';
  interval: any;

  isCheckedIfLastWorkoutIsDone = false;

  isCreate = false;
  workoutId: string;
  userLocation: any;

  routePoints: any[] = [];
  newRoutePoint = null;
  // [latitude]="54.904053" [longitude]="23.949231" ąžuolynas
  centerCoordinates = {
    lat: 54.904053,
    lng: 23.949231
  };

  infoWindow: any;
  constructor(
    private _router: Router,
    private _workoutSessionService: WorkoutSessionService) { }


  // make circles green when loaded
  loadWorkoutProgress() {
    this.routePoints.forEach(routePoint => {
      if (routePoint.index < this.currentSessionPoint) {
        routePoint.fillColour = 'green';
      }
    });
  }

  // clear routes when closing workout
  clearRoutePoints() {
    this.routePoints = [];
    this.clearInfoWindow();
    this.isWorkoutSession = false;
    this.isCreate = false;
    this.workoutId = null;
    this.currentSessionPoint = 0;
    this.userLocation = null;
    this.newRoutePoint = null;
  }

  // clear info box when closed
  clearInfoWindow() {
    this.infoWindow = null;
  }

  // to change currentLocation coordinates and if it's in the circle, change color of it
  changeUserLocation(location: any) {
    this.userLocation = location;
    this.routePoints.forEach(routePoint => {
      if (this.arePointsNear(this.userLocation, routePoint, routePoint.radius / 1000) && this.currentSessionPoint === routePoint.index) {

        // siust requesta su tasko id
        this.updateWorkoutSession(routePoint);
      }
    });

  }

  // to update workout progress
  updateWorkoutSession(routePoint: any = null) {
    this._workoutSessionService.updateWorkoutSession(this.currentSessionPoint, this.workoutId).subscribe((result: any) => {
      if (result.status === 0 || result.status === 2) {
        this.destroyInterval();
        this.clearRoutePoints();
        this._router.navigate(['workout']);
        console.log('sesija pabaigta');
      } else {
        routePoint.fillColour = 'green';
        this.currentSessionPoint++;
        console.log('taskas iveiktas');
      }
    });
  }

  // to start workout session
  startWorkoutSession() {
    this.startCheckingCurrentCoords();
    // siust request ir sukurimo metu sukurt workout
    this._workoutSessionService.createWorkoutSession(this.workoutId).subscribe((result: any) => {
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
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.changeUserLocation({
            lng: position.coords.longitude,
            lat: position.coords.latitude
          });
        },
        error => {
          switch (error.code) {
            case 1:
              this.message = 'Permission Denied';
              break;
            case 2:
              this.message = 'Position Unavailable';
              break;
            case 3:
              this.message = 'timeout';
              break;
          }
        }
      );
    } else {
      this.message = 'unsupported browser for location??';
    }
  }

  destroyInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // ----------------------------------------- route creation ---------------------------------------------------

  // create new route point
  addNewRoutePoint() {
    this.newRoutePoint = {
      lat: this.centerCoordinates.lat,
      lng: this.centerCoordinates.lng,
      radius: 50,
      fillColour: 'blue',
      circleDraggable: true,
      editable: true,
      index: this.routePoints.length + 1
    };
    this.isCreate = true;
  }

  saveRoutePoint() {
    this.routePoints.push(Object.assign({}, this.newRoutePoint));
    this.lockLastRoutePoint();
    this.newRoutePoint = null;
  }

  removeRoutePoint() {
    // cia pakeiciau nepatikrines ar veikia, bet turetu veikt
    // this.routePoints[this.routePoints.length - 1].editable = true;
    // this.routePoints[this.routePoints.length - 1].circleDraggable = true;
    // this.routePoints[this.routePoints.length - 1].fillColour = 'blue';
    // this.newRoutePoint = this.routePoints[this.routePoints.length - 1];
    this.routePoints.pop();

  }

  updateLastCoordinates(coords: any) {
    this.newRoutePoint.lat = coords.lat;
    this.newRoutePoint.lng = coords.lng;
    this.lockLastRoutePoint();
  }

  // to check if the coordinate is inside a circle
  private arePointsNear(checkPoint, centerPoint, km): boolean {
    const ky = 40000 / 360;
    const kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    // console.log('dydis', Math.sqrt(dx * dx + dy * dy));
    // console.log('km', km);
    return Math.sqrt(dx * dx + dy * dy) <= km;
  }

  // when creating
  private lockLastRoutePoint() {
    if (this.routePoints.length > 0) {
      this.routePoints[this.routePoints.length - 1].editable = false;
      this.routePoints[this.routePoints.length - 1].circleDraggable = false;
      this.routePoints[this.routePoints.length - 1].fillColour = 'black';
    }
  }

}
