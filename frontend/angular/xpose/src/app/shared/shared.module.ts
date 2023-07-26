// shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, IonicModule, FormsModule], // Add IonicModule and FormsModule here
  exports: [FooterComponent],
})
export class SharedModule {}
