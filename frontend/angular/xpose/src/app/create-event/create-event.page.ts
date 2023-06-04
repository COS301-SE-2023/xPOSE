import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-create-event",
	templateUrl: "./create-event.page.html",
	styleUrls: ["./create-event.page.scss"],
})
export class CreateEventPage implements OnInit {

  eventName!: string;
  eventDesc!: string;
  selectedFile!: File;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
  	const formData = new FormData();
  	formData.append("eventName", this.eventName);
  	formData.append("eventDesc", this.eventDesc);
  	formData.append("coverImage", this.selectedFile);

  	this.http.post("http://localhost:5000/api/create-event", formData, { withCredentials: true }).subscribe(
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

  onFileSelected(event: any) {
  	this.selectedFile = event.target.files[0];
  }
}
