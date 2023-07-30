import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersFriendsPageRoutingModule } from './users-friends-routing.module';

import { UsersFriendsPage } from './users-friends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersFriendsPageRoutingModule
  ],
  declarations: [UsersFriendsPage]
})
export class UsersFriendsPageModule {}
