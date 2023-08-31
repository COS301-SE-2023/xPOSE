import { Component, OnInit,NgZone } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Router } from '@angular/router';
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
		private router: Router
		) {
			this.signUpForm = this.formBuilder.group({
				email: ["", [Validators.required, Validators.email, this.customEmailValidator()]],
				password: ["", [Validators.required, this.customPasswordValidator()]],
				username: ["", [Validators.required]]
			 });

		}

		customEmailValidator(): ValidatorFn {
			return (control: AbstractControl): { [key: string]: any } | null => {
			  // Regular expression to match the custom email format
			  const emailRegex = /^[a-zA-Z0-9._%+-]+@...\.com$/;
		
			  // Get the email value from the form control
			  const email = control.value;
		
			  // Check if the email matches the custom format
			  const isValid = emailRegex.test(email);
		
			  // Return validation error if the email is not valid
			  return isValid ? null : { customEmail: true };
			};
		  }

		signUp() {
			const email = this.signUpForm.get("email")?.value;
			const password = this.signUpForm.get("password")?.value;
			const username = this.signUpForm.get("username")?.value;
			this.authService.signUp(email, password, username);
			this.router.navigate(["/home"]);
		}

		// Custom password validator function
		customPasswordValidator(): ValidatorFn {
			return (control: AbstractControl): { [key: string]: any } | null => {
			  // Regular expressions to check password requirements
			  const lengthRegex = /.{8}/;
			  const uppercaseRegex = /[A-Z]/;
			  const lowercaseRegex = /[a-z]/;
			  const digitRegex = /\d/;
		
			  // Get the password value from the form control
			  const password = control.value;
		
			  // Check if the password meets all the requirements
			  const isLengthValid = lengthRegex.test(password);
			  const hasUppercase = uppercaseRegex.test(password);
			  const hasLowercase = lowercaseRegex.test(password);
			  const hasDigit = digitRegex.test(password);
		
			  // Return validation errors if the password is not valid
			  if (!isLengthValid) {
				return { passwordLength: true };
			  }
			  if (!hasUppercase || !hasLowercase || !hasDigit) {
				return { passwordRequirements: true };
			  }
		
			  return null; // Password is valid
			};
		  }


	ngOnInit() {
		// TODO document why this method 'ngOnInit' is empty
  
	}
}
