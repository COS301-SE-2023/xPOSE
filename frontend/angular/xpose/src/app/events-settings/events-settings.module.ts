import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsSettingsPageRoutingModule } from './events-settings-routing.module';

import { EventsSettingsPage } from './events-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsSettingsPageRoutingModule
  ],
  declarations: [EventsSettingsPage]
})
export class EventsSettingsPageModule {}
