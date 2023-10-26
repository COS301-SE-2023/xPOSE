import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCollectionPageRoutingModule } from './view-collection-routing.module';

import { ViewCollectionPage } from './view-collection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCollectionPageRoutingModule
  ],
  declarations: [ViewCollectionPage]
})
export class ViewCollectionPageModule {}
