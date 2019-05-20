import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';

import { WorkoutService } from '../services/workout/workout-create/workout.service';
import { WorkoutHttpService } from '../services/workout/workout/workout-http.service';
import { Marker, Position, Circle, Polyline } from 'nativescript-google-maps-sdk';
import { android as androidApp, AndroidApplication } from "tns-core-modules/application";
import { registerElement } from "nativescript-angular/element-registry";
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);
@Component({
    selector: 'ns-workout-session',
    templateUrl: './workout-session.component.html',
    styleUrls: ['./workout-session.component.css'],
    moduleId: module.id,
})
export class WorkoutSessionComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild("MapView") mapView: ElementRef;
    @Input() workoutId: string;

    locationString: string;
    tempIndex = 0;

    constructor(public workoutService: WorkoutService,
        private _workoutHttpService: WorkoutHttpService) {

    }

    // for presentation - coordinates on touch
    imitateLocation(event: any): void {
        if (this.workoutService.isSessionStarted && this.workoutService.currentSessionPoint > 0) {
            if (!this.workoutService.userLocation) {
                this.workoutService.userLocation = new Marker();
                this.workoutService.changeUserLocation(event.position);
                this.workoutService.map.addMarker(this.workoutService.userLocation);
            } else {
                this.workoutService.changeUserLocation(event.position);
            }
        }

    }

    // workout loading
    ngOnChanges(changes: SimpleChanges): void {
        const workoutId: SimpleChange = changes.workoutId;
        if (workoutId.currentValue != null) {
            this._workoutHttpService.getUserWorkout(this.workoutId).subscribe((workout: any) => {
                if (!this.workoutService.isSessionStarted) {
                    this.workoutService.clearRoutePoints();
                    this.workoutService.map.clear();
                }
                this.initializeWorkoutValues(workout);
            });
        }
    }
    // workout value mapping
    private initializeWorkoutValues(workout: any): void {
        this.workoutService.workoutId = this.workoutId;
        let pl = new Polyline();
        workout.workoutWithRoutePoints.forEach(route => {
            let rp = new Circle();
            rp.id = route.id;
            rp.clickable = route.clickable;
            rp.center = Position.positionFromLatLng(route.lat, route.lng);
            pl.addPoint(rp.center);
            rp.radius = route.radius;
            rp.zIndex = route.index;
            this.workoutService.routePoints.push(rp);
            this.workoutService.map.addCircle(this.workoutService.routePoints[this.workoutService.routePoints.length - 1]);

        });
        this.workoutService.polyline = pl;
        this.workoutService.map.addPolyline(this.workoutService.polyline);
        if (this.workoutService.currentSessionPoint > 1) {
            this.workoutService.isSessionStarted = true;
            this.workoutService.loadWorkoutProgress();
        }
    }

    //Map events
    onMapReady = (event) => {
        this.workoutService.map = event.object;
    };

    startWorkout(): void {
        this.workoutService.startWorkoutSession();
    }

    endWorkoutSession(): void {
        if (this.workoutService.isSessionStarted) {
            this.workoutService.currentSessionPoint = -1;
            this.workoutService.updateWorkoutSession();
        }
    }

    // methods so that map would not fall asleep
    ngOnInit() {
        if (androidApp) {
            androidApp.on(AndroidApplication.activityResumedEvent, this.onAndroidActivityResume, this);
        }
    }

    ngOnDestroy() {
        if (androidApp) {
            androidApp.off(AndroidApplication.activityResumedEvent, this.onAndroidActivityResume, this);
        }
    }

    private onAndroidActivityResume(args) {
        if (this.workoutService.map && this.workoutService.map.nativeView && this.workoutService.map._context === args.activity) {
            this.workoutService.map.nativeView.onResume();
        }
    }

}
