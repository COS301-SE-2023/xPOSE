import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-signup",
	templateUrl: "./signup.page.html",
	styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {

  name!: string;
  email!: string;
  password!: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

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
}
