import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventPage } from './event.page';

const routes: Routes = [
  {
    path: '',
    component: EventPage,
    children : [
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
      },  
      {
        path: "posts",
        loadChildren: () => import("./posts/posts.module").then(m => m.PostsPageModule)
      },
      {
        path: "message-board",
        loadChildren: () => import("./message-board/message-board.module").then(m => m.MessageBoardPageModule)
      },
      {
        path: "details",
        loadChildren: () => import("./details/details.module").then(m => m.DetailsPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventPageRoutingModule {}
