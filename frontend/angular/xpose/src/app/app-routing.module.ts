import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
	  path: "home",
	  loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
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
	  path: "event",
	  loadChildren: () => import("./event/event.module").then(m => m.EventPageModule)
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
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },  {
    path: 'footer',
    loadChildren: () => import('./footer/footer.module').then( m => m.FooterPageModule)
  },
  {
    path: 'header',
    loadChildren: () => import('./header/header.module').then( m => m.HeaderPageModule)
  },


  ];
  
  @NgModule({
	imports: [
	  RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
