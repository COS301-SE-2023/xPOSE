import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPicturesPageRoutingModule } from './my-pictures-routing.module';

import { MyPicturesPage } from './my-pictures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPicturesPageRoutingModule
  ],
  declarations: [MyPicturesPage]
})
export class MyPicturesPageModule {}
