import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class TabChangeService {
    tabChangeSubject = new Subject<any>();

    constructor() { }

    getTabChangeObservable(): Observable<any> {
        return this.tabChangeSubject.asObservable();
    }

    setNewTabValue(tab: any): void {
        this.tabChangeSubject.next(tab);
    }

}
