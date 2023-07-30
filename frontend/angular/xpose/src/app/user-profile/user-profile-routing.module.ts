import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfilePage } from './user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage
  },
  {
    path: 'users-events',
    loadChildren: () => import('./users-events/users-events.module').then( m => m.UsersEventsPageModule)
  },
  {
    path: 'users-friends',
    loadChildren: () => import('./users-friends/users-friends.module').then( m => m.UsersFriendsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfilePageRoutingModule {}
