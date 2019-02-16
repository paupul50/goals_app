import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "tracker", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/modules/dashboard/dashboard.module#DashboardModule"},
    { path: "tracker", loadChildren: "~/app/modules/tracker/tracker.module#TrackerModule"}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
