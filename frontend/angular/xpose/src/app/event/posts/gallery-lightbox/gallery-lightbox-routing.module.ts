import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GalleryLightboxPage } from './gallery-lightbox.page';

const routes: Routes = [
  {
    path: '',
    component: GalleryLightboxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GalleryLightboxPageRoutingModule {}
