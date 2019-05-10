import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { enableLocationRequest } from 'nativescript-geolocation';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
    selector: 'ns-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    moduleId: module.id,
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    constructor(private fb: FormBuilder, private userService: UserService, private _router: Router, private _page: Page) {
        this.addControls();
    }

    ngOnInit(): void {
        enableLocationRequest(true);
        this._page.actionBarHidden = true;
    }

    addControls() {
        this.form = this.fb.group({
            'username': ['kazkas', Validators.compose([Validators.required])],
            'password': ['kazkas', Validators.required]
        });
    }
    onSubmit() {
        if (this.form.valid) {
            this.userService.login(this.form.value.username, this.form.value.password).subscribe((result: any) => {
                if (result === true) {
                    this._router.navigate(['workouts']);
                }
            });
        }
    }

}
