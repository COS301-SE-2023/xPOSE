import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewEventPageRoutingModule } from './view-event-routing.module';

import { ViewEventPage } from './view-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewEventPageRoutingModule
  ],
  declarations: [ViewEventPage]
})
export class ViewEventPageModule {}
