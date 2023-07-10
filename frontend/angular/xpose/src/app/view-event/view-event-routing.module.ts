import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewEventPage } from './view-event.page';

const routes: Routes = [
  {
    path: '',
    component: ViewEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewEventPageRoutingModule {}
