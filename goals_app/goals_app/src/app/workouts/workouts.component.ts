import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { TabChangeService } from '../services/tab-change/tab-change.service';

@Component({
    selector: 'ns-workouts',
    templateUrl: './workouts.component.html',
    styleUrls: ['./workouts.component.css'],
    moduleId: module.id,
})
export class WorkoutsComponent implements OnInit {
    tabIndex = 0;
    workoutId = null;
    constructor(private userService: UserService, private _router: Router, private tabChangeService: TabChangeService) {
        // this._activatedRoute.params.subscribe((params: Params) => {
        //     // this.id = params['id'];
        //     console.log('route', params);
        //   });
        this.tabChangeService.getTabChangeObservable().subscribe((tab:any)=>{
            this.tabIndex = tab.tabNumber;
            this.workoutId = tab.id;
        })
    }

    ngOnInit() {
    }

    tabIndexChanged(event: any) {
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
