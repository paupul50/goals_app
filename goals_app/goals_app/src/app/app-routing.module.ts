import { WorkoutSessionComponent } from './workout-session/workout-session.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: 'workouts', component: WorkoutsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
