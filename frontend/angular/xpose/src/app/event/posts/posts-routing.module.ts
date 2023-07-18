import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsPage } from './posts.page';

const routes: Routes = [
  {
    path: '',
    component: PostsPage
  },  {
    path: 'gallery-lightbox',
    loadChildren: () => import('./gallery-lightbox/gallery-lightbox.module').then( m => m.GalleryLightboxPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsPageRoutingModule {}
