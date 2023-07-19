import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryLightboxPageRoutingModule } from './gallery-lightbox-routing.module';

// import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // IonicModule,
    GalleryLightboxPageRoutingModule,
    // MatIconModule,
  ],
  declarations: []
})
export class GalleryLightboxPageModule {}
