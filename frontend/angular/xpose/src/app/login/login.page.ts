import { Component, OnInit } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";

@Component({
	selector: "app-login",
	templateUrl: "./login.page.html",
	styleUrls: ["./login.page.scss"],
	})
export class LoginPage implements OnInit {
	// email: string = "";
	// password: string = "";
	loading!: HTMLIonLoadingElement;

	loginForm: FormGroup;
	constructor( 
		private formBuilder: FormBuilder,
		public authService: AuthService,
		private router: Router,
		private loadingController: LoadingController
	) {
		this.loginForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required]]
		 });
	}

	// sign in with email and password
	async signIn() {
		const email = this.loginForm.get("email")?.value;
		const password = this.loginForm.get("password")?.value;
		this.authService.signIn(email, password);

		try {
			this.loading = await this.loadingController.create({
			  message: "Logging in...",
			});
			await this.loading.present();
	
			await this.authService.signIn(email, password);
	
			this.loading.dismiss();
			this.router.navigate(["/home"]);
		  } catch (error) {
			this.loading.dismiss();
			console.error("Login error:", error);
		  }
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
