import { Component, OnInit } from "@angular/core";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { Router } from "@angular/router";
import { TabView } from "tns-core-modules/ui/tab-view";

@Component({
  selector: "ns-tracker",
  templateUrl: "./tracker.component.html",
  styleUrls: ["./tracker.component.css"],
  moduleId: module.id
})
export class TrackerComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onSelectedIndexChanged(event: SelectedIndexChangedEventData): void {
    console.log(event.oldIndex);
    console.log(event.newIndex);
    console.log(event.object);
    console.log(event.eventName);
    console.log(this.router.url);
  }
}
