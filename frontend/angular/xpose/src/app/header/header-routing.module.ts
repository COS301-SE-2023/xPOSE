import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeaderPage } from './header.page';

const routes: Routes = [
  {
    path: '',
    component: HeaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeaderPageRoutingModule {}
