import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';

import { WorkoutCreateService } from '../services/workout/workout-create/workout-create.service';
import { WorkoutService } from '../services/workout/workout/workout.service';
import { MapView, Marker, Position, Circle, Polyline } from 'nativescript-google-maps-sdk';
import { enableLocationRequest, isEnabled, getCurrentLocation } from "nativescript-geolocation";
import { on as applicationOn, launchEvent, suspendEvent, resumeEvent, exitEvent, lowMemoryEvent, uncaughtErrorEvent, ApplicationEventData } from "tns-core-modules/application";
import { android as androidApp, AndroidApplication } from "tns-core-modules/application";
import { registerElement } from "nativescript-angular/element-registry";
import { Color } from 'tns-core-modules/color/color';
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

    constructor(public workoutCreateService: WorkoutCreateService,
        private _workoutService: WorkoutService) {

    }

    imitateLocation(event: any) {
        if (this.workoutCreateService.isSessionStarted && this.workoutCreateService.currentSessionPoint > 0) {
            if (!this.workoutCreateService.userLocation) {
                this.workoutCreateService.userLocation = new Marker();
                this.workoutCreateService.changeUserLocation(event.position);
                this.workoutCreateService.map.addMarker(this.workoutCreateService.userLocation);
            } else {
                this.workoutCreateService.changeUserLocation(event.position);
            }
        }

    }

    // workout loading
    ngOnChanges(changes: SimpleChanges) {
        const workoutId: SimpleChange = changes.workoutId;
        if (workoutId.currentValue != null) {
            this._workoutService.getUserWorkout(this.workoutId).subscribe((workout: any) => {
                if (!this.workoutCreateService.isSessionStarted) {
                    this.workoutCreateService.clearRoutePoints();
                    this.workoutCreateService.map.clear();
                }
                this.initializeWorkoutValues(workout);
            });
        }
    }

    private initializeWorkoutValues(workout: any) {
        this.workoutCreateService.workoutId = this.workoutId;
        let pl = new Polyline();
        workout.workoutWithRoutePoints.forEach(route => {
            let rp = new Circle();
            rp.clickable = route.clickable;
            rp.center = Position.positionFromLatLng(route.lat, route.lng);
            pl.addPoint(rp.center);
            rp.radius = route.radius;
            rp.zIndex = route.index;
            this.workoutCreateService.routePoints.push(rp);
            this.workoutCreateService.map.addCircle(this.workoutCreateService.routePoints[this.workoutCreateService.routePoints.length - 1]);

        });
        this.workoutCreateService.polyline = pl;
        this.workoutCreateService.map.addPolyline(this.workoutCreateService.polyline);
        if (this.workoutCreateService.currentSessionPoint > 1) {
            this.workoutCreateService.isSessionStarted = true;
            this.workoutCreateService.loadWorkoutProgress();
        }
    }
    //Map events
    onMapReady = (event) => {
        this.workoutCreateService.map = event.object;
    };

    onTap() {
        console.log(this.workoutId);
        // this.getPosition();
    }

    startWorkout() {
        this.workoutCreateService.startWorkoutSession();
    }

    endWorkoutSession() {
        if (this.workoutCreateService.isSessionStarted) {
            this.workoutCreateService.currentSessionPoint = -1;
            this.workoutCreateService.updateWorkoutSession();
        }
    }

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
        if (this.workoutCreateService.map && this.workoutCreateService.map.nativeView && this.workoutCreateService.map._context === args.activity) {
            this.workoutCreateService.map.nativeView.onResume();
        }
    }

}
