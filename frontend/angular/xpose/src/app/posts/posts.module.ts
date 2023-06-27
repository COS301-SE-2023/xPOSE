import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PostsPageRoutingModule } from './posts-routing.module';
import { PostsPage } from './posts.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PostsPageRoutingModule
  ],
  declarations: [PostsPage]
})
export class PostsPageModule { }
