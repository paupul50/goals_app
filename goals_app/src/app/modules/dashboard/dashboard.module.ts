import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { HomeComponent } from "./components/home/home.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        DashboardRoutingModule
    ],
    declarations: [
        HomeComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class DashboardModule { }
