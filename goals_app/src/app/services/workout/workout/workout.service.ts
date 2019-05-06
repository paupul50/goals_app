import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(private _http: HttpClient, private _userService: UserService) { }

  deleteWorkout(id: string): Observable<any> {
    return this._http.delete(this._userService.BACKURL + 'api/workout/' + id, { headers: this._userService.getHeaders() });
  }

  createWorkout(name: string, routePoints: any[]): Observable<any> {
    const body = JSON.stringify({
      Name: name,
      RoutePoints: routePoints
    });
    return this._http.post(this._userService.BACKURL + 'api/workout', body,
      { headers: this._userService.getHeaders() });
  }

  getUserWorkouts(): Observable<any> {
    return this._http.get(this._userService.BACKURL + 'api/workout/user', { headers: this._userService.getHeaders() });
  }

  getUserUnusedWorkouts(): Observable<any> {
    return this._http.get(this._userService.BACKURL + 'api/workout/unused', { headers: this._userService.getHeaders() });
  }

  getGroupUnusedWorkouts(): Observable<any> {
    return this._http.get(this._userService.BACKURL + 'api/workout/groupUnused', { headers: this._userService.getHeaders() });
  }

  getGroupWorkouts(): Observable<any> {
    return this._http.get(this._userService.BACKURL + 'api/workout/group', { headers: this._userService.getHeaders() });
  }

  getUserWorkout(id: string): Observable<any> {
    return this._http.get(this._userService.BACKURL + 'api/workout/' + id, { headers: this._userService.getHeaders() });
  }
}
