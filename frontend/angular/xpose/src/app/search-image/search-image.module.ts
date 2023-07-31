import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchImagePageRoutingModule } from './search-image-routing.module';

import { SearchImagePage } from './search-image.page';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchImagePageRoutingModule,
    SharedModule
  ],
  declarations: [SearchImagePage]
})
export class SearchImagePageModule {}
