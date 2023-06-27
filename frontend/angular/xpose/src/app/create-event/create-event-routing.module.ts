import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CreateEventPage } from "./create-event.page";
import { HttpClientModule } from "@angular/common/http";

const routes: Routes = [
	{
		path: "",
		component: CreateEventPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes),
	HttpClientModule
	],
	exports: [RouterModule,
	HttpClientModule
	],
	})
export class CreateEventPageRoutingModule {}
