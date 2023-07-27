import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventPageRoutingModule } from './event-routing.module';

import { EventPage } from './event.page';

import { GalleryLightboxPage } from './posts/gallery-lightbox/gallery-lightbox.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventPageRoutingModule,
    SharedModule
  ],
  declarations: [EventPage,
    GalleryLightboxPage]
})
export class EventPageModule {}
