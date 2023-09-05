import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsSettingsPage } from './events-settings.page';

const routes: Routes = [
  {
    path: '',
    component: EventsSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsSettingsPageRoutingModule {}
