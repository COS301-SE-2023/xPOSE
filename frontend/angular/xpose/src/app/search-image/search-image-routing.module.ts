import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchImagePage } from './search-image.page';

const routes: Routes = [
  {
    path: '',
    component: SearchImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchImagePageRoutingModule {}
