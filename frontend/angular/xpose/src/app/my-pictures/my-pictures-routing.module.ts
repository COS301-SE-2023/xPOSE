import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPicturesPage } from './my-pictures.page';

const routes: Routes = [
  {
    path: '',
    component: MyPicturesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPicturesPageRoutingModule {}
