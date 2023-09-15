import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./shared/guard/auth.guard";
import { FriendListComponent } from "./friend-list/friend-list.component";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
    ,canActivate:[AuthGuard],
    data: {title: 'xPOSE' }
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "signup",
    loadChildren: () => import("./signup/signup.module").then(m => m.SignupPageModule)
  },
  {
    path: "login",
    loadChildren: () => import("./login/login.module").then(m => m.LoginPageModule)
  },
  {
    path: "create-event",
    loadChildren: () => import("./create-event/create-event.module").then(m => m.CreateEventPageModule)
    ,canActivate:[AuthGuard],
    data: {title: 'Create Event' }
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/profile.module").then(m => m.ProfilePageModule)
    ,canActivate:[AuthGuard],
    data: {title: 'Profile' }
  },
  {
    path: "settings",
    loadChildren: () => import("./settings/settings.module").then(m => m.SettingsPageModule),
    data: {title: 'Settings' }
  },
  {
    path: "event/:id",
    loadChildren: () => import("./event/event.module").then(m => m.EventPageModule),
    data: {title: 'Event' }
  },
  {
    path: "notification",
    loadChildren: () => import("./notification/notification.module").then(m => m.NotificationPageModule)
    ,canActivate:[AuthGuard],
    data: {title: 'Notifications' }
  },
  {
    path: "joined-event",
    loadChildren: () => import("./joined-event/joined-event.module").then(m => m.JoinedEventPageModule),
    data: {title: 'Joined Events' }
  },
  {
    path: "post-details",
    loadChildren: () => import("./post-details/post-details.module").then(m => m.PostDetailsPageModule)
  },
  { 
    path: 'friends/:id', component: FriendListComponent 
  },
  {
    path: 'view-event/:id',
    loadChildren: () => import('./view-event/view-event.module').then( m => m.ViewEventPageModule)
    ,canActivate:[AuthGuard],
    data: {title: 'View Event' }
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule),
    data: {title: 'Edit Profile' }
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'user-profile/:id/:id',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
  path: 'user-profile/:id',
  loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
},
  {
    path: 'search-image',
    loadChildren: () => import('./search-image/search-image.module').then( m => m.SearchImagePageModule)
  },
  {
    path: 'events-settings',
    loadChildren: () => import('./events-settings/events-settings.module').then( m => m.EventsSettingsPageModule),
    data: {title: 'Settings' }
  },
  {
    path: 'friends',
    loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule),
    data: {title: 'Friends' }
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
