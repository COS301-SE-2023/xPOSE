import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageBoardPageRoutingModule } from './message-board-routing.module';

import { MessageBoardPage } from './message-board.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageBoardPageRoutingModule
  ],
  declarations: [MessageBoardPage]
})
export class MessageBoardPageModule {}
