import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutCreateService } from '../services/workout/workout-create/workout-create.service';
import { WorkoutService } from '../services/workout/workout/workout.service';
import { WorkoutSessionService } from '../services/workout/workout-session/workout-session.service';
import { TabChangeService } from '../services/tab-change/tab-change.service';

@Component({
    selector: 'ns-workout-list',
    templateUrl: './workout-list.component.html',
    styleUrls: ['./workout-list.component.css'],
    moduleId: module.id,
})
export class WorkoutListComponent implements OnInit {
    workouts: any[];
    groupWorkouts: any[];
    isGroupWorkoutsLoaded = false;
    isWorkoutsLoaded = false;
    constructor(
        private _workoutCreateService: WorkoutCreateService,
        private _workoutService: WorkoutService,
        private _workoutSessionService: WorkoutSessionService,
        private _router: Router,
        private _tabChangeService: TabChangeService) {
        // load user workouts
        this._workoutService.getUserWorkouts().subscribe((workouts: any[]) => {
            this.workouts = workouts;
            // console.log('workouts', this.workouts);
            this.isWorkoutsLoaded = true;
        });
        // load group workouts
        this._workoutService.getGroupWorkouts().subscribe((workouts: any[]) => {
            this.groupWorkouts = workouts;
            // console.log('group workouts', this.groupWorkouts);

            this.isGroupWorkoutsLoaded = true;
        });
        this._workoutSessionService.GetCurrentWorkoutSession().subscribe((result: any) => {
            if (result == null) { // if no active workout session
                this._workoutCreateService.isCheckedIfLastWorkoutIsDone = true;
            } else { // if workout session is active
                this._workoutCreateService.isCheckedIfLastWorkoutIsDone = true;
                this._workoutCreateService.isWorkoutSession = true;
                this._workoutCreateService.currentSessionPoint = result.progressIndex;
                this._workoutCreateService.startCheckingCurrentCoords();
                //   this._router.navigate(['/session', result.workoutId]);
                console.log('sesija jau yra!!!!!');
            }
        });
        // check if are any workouts are in progress GetCurrentWorkoutSession
    }

    onItemTap(event: any) {
        this._tabChangeService.setNewTabValue({tabNumber: 1, id: this.workouts[event.index].id});

    }

    ngOnInit(): void {
        // console.log('init');
    }

}
