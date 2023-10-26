import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewCollectionPage } from './view-collection.page';

const routes: Routes = [
  {
    path: '',
    component: ViewCollectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewCollectionPageRoutingModule {}
