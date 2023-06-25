import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { AuthService } from "../shared/services/auth.service";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.page.html",
	styleUrls: ["./signup.page.scss"],
	})
export class SignupPage implements OnInit {
	signUpForm: FormGroup;
	constructor(
		public authService: AuthService,
		private formBuilder: FormBuilder,
		) {
			this.signUpForm = this.formBuilder.group({
				email: ["", [Validators.required, Validators.email]],
				password: ["", [Validators.required]],
				username: ["", [Validators.required]]
			 });

		}

		signUp() {
			const email = this.signUpForm.get("email")?.value;
			const password = this.signUpForm.get("password")?.value;
			const username = this.signUpForm.get("username")?.value;
			console.log("Email: ", email);
			console.log("password: ", password);
			console.log("username: ", username);
			this.authService.signUp(email, password, username);
		}
	ngOnInit() {
		// TODO document why this method 'ngOnInit' is empty
  
	}
}
