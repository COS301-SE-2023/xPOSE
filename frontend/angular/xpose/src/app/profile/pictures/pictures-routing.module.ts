import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PicturesPage } from './pictures.page';

const routes: Routes = [
  {
    path: '',
    component: PicturesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PicturesPageRoutingModule {}
