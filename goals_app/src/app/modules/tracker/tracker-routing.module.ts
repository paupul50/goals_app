import { WorkoutComponent } from "./components/tracker/workout/workout.component";
import { GoalsComponent } from "./components/tracker/goals/goals.component";
import { SportswareComponent } from "./components/tracker/sportsware/sportsware.component";
import { UserSettingsComponent } from "./components/tracker/user-settings/user-settings.component";
import { TrackerComponent } from "./components/tracker/tracker.component";
import { BluetoothComponent } from "./components/tracker/sportsware/bluetooth/bluetooth.component";
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const childRoutes: Routes = [
  {
    path: "",
    component: TrackerComponent,
    children: [
      { path: "goals", component: GoalsComponent },
      { path: "workout", component: WorkoutComponent },
      { path: "sportsware", component: SportswareComponent },
      { path: "settings", component: UserSettingsComponent },
      { path: "bluetooth", component: BluetoothComponent, outlet: "sportsware" }
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(childRoutes)],
  exports: [NativeScriptRouterModule]
})
export class TrackerRoutingModule {}
