import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SendFriendRequestsComponent } from './send-friend-requests.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [SendFriendRequestsComponent],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule
     /*HttpClientModule*/],
})
export class SendFriendRequestsModule {}
