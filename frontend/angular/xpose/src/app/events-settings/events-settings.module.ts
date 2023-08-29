import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsSettingsPageRoutingModule } from './events-settings-routing.module';

import { EventsSettingsPage } from './events-settings.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [EventsSettingsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EventsSettingsPageRoutingModule,
        SharedModule
    ]
})
export class EventsSettingsPageModule {}
