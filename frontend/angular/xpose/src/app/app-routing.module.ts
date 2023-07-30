import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./shared/guard/auth.guard";
import { SendFriendRequestsComponent } from "./send-friend-requests/send-friend-requests.component";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
    , canActivate:[AuthGuard]
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
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/profile.module").then(m => m.ProfilePageModule)
  },
  {
    path: "settings",
    loadChildren: () => import("./settings/settings.module").then(m => m.SettingsPageModule)
  },
  {
    path: "header",
    loadChildren: () => import("./header/header.module").then(m => m.HeaderPageModule)
  },
  {
    path: "event/:id",
    loadChildren: () => import("./event/event.module").then(m => m.EventPageModule)
  },
  {
    path: "notification",
    loadChildren: () => import("./notification/notification.module").then(m => m.NotificationPageModule)
  },
  {
    path: "joined-event",
    loadChildren: () => import("./joined-event/joined-event.module").then(m => m.JoinedEventPageModule)
  },
  {
    path: "post-details",
    loadChildren: () => import("./post-details/post-details.module").then(m => m.PostDetailsPageModule)
  },
  { 
    path: 'send-friend-requests', component: SendFriendRequestsComponent 
  },
  {
    path: 'view-event/:id',
    loadChildren: () => import('./view-event/view-event.module').then( m => m.ViewEventPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
