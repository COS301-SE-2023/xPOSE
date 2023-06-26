import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageBoardPage } from './message-board.page';

const routes: Routes = [
  {
    path: '',
    component: MessageBoardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageBoardPageRoutingModule {}
