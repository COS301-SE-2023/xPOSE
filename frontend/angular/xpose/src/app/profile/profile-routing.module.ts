import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfilePage } from "./profile.page";

const routes: Routes = [
	{
		path: "",
		component: ProfilePage,
    children : [
    {
      path: 'friends',
      loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule)
    },
    {
      path: 'events',
      loadChildren: () => import('./events/events.module').then( m => m.EventsPageModule)
    },
  ]
  },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
