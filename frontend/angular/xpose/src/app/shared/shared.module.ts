// shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { BackbuttonComponent } from '../shared/backbutton/backbutton.component';
import { LoadingPageComponent } from '../shared/loading-icon/loading-icon.component';


@NgModule({
  declarations: [FooterComponent, BackbuttonComponent, LoadingPageComponent],
  imports: [CommonModule, IonicModule, FormsModule], // Add IonicModule and FormsModule here
  exports: [FooterComponent, BackbuttonComponent, LoadingPageComponent],
})
export class SharedModule {}
