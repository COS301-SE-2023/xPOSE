import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.page.html",
	styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
<<<<<<< HEAD
=======

  onSubmit() {
  	const formData = {
  		name: this.name,
  		email: this.email,
  		password: this.password
  	};

  	this.http.post("https://example.com/api/signup", formData).subscribe(
  		response => {
  			console.log("API response:", response);
  			// Handle successful API response
  		},
  		error => {
  			console.error("API error:", error);
  			// Handle API error
  		}
  	);
  }
>>>>>>> c286ff92a86e9a7a2a62d9fafa39fac53c3a43b9
}
