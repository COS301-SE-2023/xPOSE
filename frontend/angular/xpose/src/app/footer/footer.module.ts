import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FooterPageRoutingModule } from './footer-routing.module';

import { FooterPage } from './footer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FooterPageRoutingModule
  ],
  declarations: [FooterPage]
})
export class FooterPageModule {}
