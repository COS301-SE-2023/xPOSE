import { Component, OnInit } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: "app-login",
	templateUrl: "./login.page.html",
	styleUrls: ["./login.page.scss"],
	})
export class LoginPage implements OnInit {
	// email: string = "";
	// password: string = "";

	loginForm: FormGroup;
	constructor( 
		private formBuilder: FormBuilder,
		public authService: AuthService,
	) {
		this.loginForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required]]
		 });
	}

	// sign in with email and password
	signIn() {
		const email = this.loginForm.get("email")?.value;
		const password = this.loginForm.get("password")?.value;
		// console.log("Email: ", email);
		// console.log("password: ", password);
		this.authService.signIn(email, password);
	}

	// sign in with facebook
	signInWithFacebook() {
		this.authService.signInWithFacebook();
	}

	// sign in with google
	signInWithGoogle() {
		this.authService.signInWithGoogle();
	}


	ngOnInit() {
	}

}
