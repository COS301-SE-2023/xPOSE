import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinedViewPagePageRoutingModule } from './joined-view-page-routing.module';

import { JoinedViewPagePage } from './joined-view-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinedViewPagePageRoutingModule
  ],
  declarations: [JoinedViewPagePage]
})
export class JoinedViewPagePageModule {}
