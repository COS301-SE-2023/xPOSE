import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersEventsPageRoutingModule } from './users-events-routing.module';

import { UsersEventsPage } from './users-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersEventsPageRoutingModule
  ],
  declarations: [UsersEventsPage]
})
export class UsersEventsPageModule {}
