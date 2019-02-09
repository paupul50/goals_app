import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    //temp
    tempData: string[];
    europianCountries = ["pirmas", "antras"];
    private _headers = new HttpHeaders({
        "Content-Type": "application/json",
    });

    constructor(private http: HttpClient) {

    }

    ngOnInit(): void {
        // Init your component properties here.
    }
    //temp
    onTap(): void {
        this.http.get('http://localhost:52503/api/values', { headers: this._headers }).subscribe((response: string[]) => {
            this.tempData = response;
        });
        console.log(this.tempData);
    }
}
