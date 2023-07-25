import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinedEventPageRoutingModule } from './joined-event-routing.module';

import { JoinedEventPage } from './joined-event.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinedEventPageRoutingModule,
    // FooterPageModule,
  ],
  declarations: [JoinedEventPage]
    // FooterComponent]
})
export class JoinedEventPageModule {}
