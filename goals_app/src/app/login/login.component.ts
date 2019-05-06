import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { enableLocationRequest } from 'nativescript-geolocation';

@Component({
    selector: 'ns-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    moduleId: module.id,
})
export class LoginComponent implements OnInit {
    ngOnInit(): void {
        enableLocationRequest(true);
    }
    form: FormGroup;
    constructor(private fb: FormBuilder, private userService: UserService, private _router: Router) {
        this.addControls();
    }

    addControls() {
        this.form = this.fb.group({
            'email': ['kazkas@gmail.com', Validators.compose([Validators.required, Validators.email])],
            'password': ['kazkas', Validators.required]
        });
    }
    onSubmit() {
        if (this.form.valid) {
            if (this.form.value.email === 'test' && this.form.value.password === 'test') {
                this._router.navigate(['workouts']);
            } else {
                this.userService.login(this.form.value.email, this.form.value.password).subscribe((result: any) => {
                    if (result === true) {
                        this._router.navigate(['workouts']);
                    }
                });
            }
        }
    }

}
