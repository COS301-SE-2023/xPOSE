import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PostsPageRoutingModule } from './posts-routing.module';
import { PostsPage } from './posts.page';
import { NgxMasonryModule } from 'ngx-masonry';

import { GalleryLightboxPage } from './gallery-lightbox/gallery-lightbox.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PostsPageRoutingModule,
    NgxMasonryModule,
  ],
  declarations: [
    PostsPage,
    // GalleryLightboxPage
  ],              
})
export class PostsPageModule { }
