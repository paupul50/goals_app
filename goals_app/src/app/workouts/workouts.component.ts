import { Component } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { TabChangeService } from '../services/tab-change/tab-change.service';

@Component({
    selector: 'ns-workouts',
    templateUrl: './workouts.component.html',
    styleUrls: ['./workouts.component.css'],
    moduleId: module.id,
})
export class WorkoutsComponent {
    tabIndex = 0;
    workoutId = null;

    constructor(private userService: UserService, private tabChangeService: TabChangeService) {
        this.tabChangeService.getTabChangeObservable().subscribe((tab:any)=>{
            this.tabIndex = tab.tabNumber;
            this.workoutId = tab.id;
        })
    }

    // tab navigation
    tabIndexChanged(event: any): void {
        switch (event.newIndex) {
            case 0:
                break;
            case 1:
                break;

            default:
                this.userService.logout();
                break;
        }
    }

}
