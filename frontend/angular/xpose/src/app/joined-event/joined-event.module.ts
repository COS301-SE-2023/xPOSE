import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinedEventPageRoutingModule } from './joined-event-routing.module';

import { JoinedEventPage } from './joined-event.page';

// import { FooterComponent } from '../footer/footer.component';

// import { FooterPageModule } from '../footer/footer.module'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinedEventPageRoutingModule,
    // FooterPageModule,
  ],
  declarations: [JoinedEventPage,]
    // FooterComponent]
})
export class JoinedEventPageModule {}
