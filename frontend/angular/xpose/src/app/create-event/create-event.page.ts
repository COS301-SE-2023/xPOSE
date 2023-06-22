import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
	selector: "app-create-event",
	templateUrl: "./create-event.page.html",
	styleUrls: ["./create-event.page.scss"],
	})
export class CreateEventPage implements OnInit {

	constructor(private http: HttpClient, private router: Router) { }

	ngOnInit(): void {
	}
	goBack(){
		this.router.navigate(["/home"]);
	}
}
