import { Component } from "@angular/core";

import { UserService } from "../services/user/user.service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent {
    form: FormGroup;
    constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
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
        this.userService.login(this.form.value.email, this.form.value.password).subscribe((result: any) => {
          if (result === true) {
            this.router.navigate(['/home']);
          }
        });
      }
    }
}
