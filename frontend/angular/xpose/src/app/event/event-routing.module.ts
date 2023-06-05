// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// import { EventPage } from './event.page';

// const routes: Routes = [
//   {
//     path: '',
//     component: EventPage
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class EventPageRoutingModule {}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }