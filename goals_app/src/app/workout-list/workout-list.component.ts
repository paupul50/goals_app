import { Component } from '@angular/core';
import { WorkoutService } from '../services/workout/workout-create/workout.service';
import { WorkoutHttpService } from '../services/workout/workout/workout-http.service';
import { WorkoutSessionHttpService } from '../services/workout/workout-session/workout-session-http.service';
import { TabChangeService } from '../services/tab-change/tab-change.service';
import { SnackbarService } from '../services/message-snackbar/snackbar.service';

@Component({
    selector: 'ns-workout-list',
    templateUrl: './workout-list.component.html',
    styleUrls: ['./workout-list.component.css'],
    moduleId: module.id,
})
export class WorkoutListComponent {
    workouts: any[] = [];
    groupWorkouts: any[] = [];
    isGroupWorkoutsLoaded = false;
    isWorkoutsLoaded = false;

    constructor(
        public workoutService: WorkoutService,
        private _workoutHttpService: WorkoutHttpService,
        private _workoutSessionHttpService: WorkoutSessionHttpService,
        private _tabChangeService: TabChangeService,
        private _snackbarService: SnackbarService) {
            this.initializeWorkouts();
            this.inizializeWorkoutSession();
    }

    inizializeWorkoutSession(): void {
        this._workoutSessionHttpService.GetCurrentWorkoutSession().subscribe((result: any) => {
            if (result == null) { // if no active workout session
                this.workoutService.isCheckedIfLastWorkoutIsDone = true;
            } else { // if workout session is active
                this.workoutService.isCheckedIfLastWorkoutIsDone = true;
                this.workoutService.isSessionStarted = true;
                this.workoutService.currentSessionPoint = result.progressIndex;
                this.workoutService.startCheckingCurrentCoords();
                this._tabChangeService.setNewTabValue({ tabNumber: 1, id: result.workoutId });
                this._snackbarService.openSnackBar('sesija pradėta');
            }
        });
    }

    initializeWorkouts(): void {
        this._workoutHttpService.getUserWorkouts().subscribe((workouts: any[]) => {
            this.workouts = workouts;
            this.isWorkoutsLoaded = true;
        });
        this._workoutHttpService.getGroupWorkouts().subscribe((workouts: any[]) => {
            console.log(workouts);
            this.groupWorkouts = workouts;
            this.isGroupWorkoutsLoaded = true;
        });
    }

    onItemTap(event: any, isGroup: boolean): void {
        if(isGroup) {
            this._tabChangeService.setNewTabValue({ tabNumber: 1, id: this.groupWorkouts[event.index].id });
        }else {
            this._tabChangeService.setNewTabValue({ tabNumber: 1, id: this.workouts[event.index].id });
        }
    }

}
