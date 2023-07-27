import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CreateEventPageRoutingModule } from "./create-event-routing.module";

import { CreateEventPage } from "./create-event.page";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [CreateEventPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreateEventPageRoutingModule,
        SharedModule
    ]
})
export class CreateEventPageModule {}
