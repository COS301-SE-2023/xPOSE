import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SignupPageRoutingModule } from "./signup-routing.module";

import { SignupPage } from "./signup.page";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		SignupPageRoutingModule
	],
	declarations: [SignupPage]
})
export class SignupPageModule {}
