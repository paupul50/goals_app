import { TrackerRoutingModule } from "./tracker-routing.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { BluetoothComponent } from "./components/tracker/sportsware/bluetooth/bluetooth.component";
import { TrackerComponent } from "./components/tracker/tracker.component";
import { UserSettingsComponent } from "./components/tracker/user-settings/user-settings.component";
import { GoalsComponent } from "./components/tracker/goals/goals.component";
import { SportswareComponent } from "./components/tracker/sportsware/sportsware.component";
import { WorkoutComponent } from "./components/tracker/workout/workout.component";

@NgModule({
  declarations: [
    BluetoothComponent,
    TrackerComponent,
    UserSettingsComponent,
    GoalsComponent,
    SportswareComponent,
    WorkoutComponent
  ],
  imports: [NativeScriptCommonModule, TrackerRoutingModule],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [TrackerComponent]
})
export class TrackerModule {}
