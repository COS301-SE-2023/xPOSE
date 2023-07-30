import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersEventsPage } from './users-events.page';

const routes: Routes = [
  {
    path: '',
    component: UsersEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersEventsPageRoutingModule {}
