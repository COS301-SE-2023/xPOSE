import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [UserProfilePage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserProfilePageRoutingModule,
        SharedModule
    ]
})
export class UserProfilePageModule {}
