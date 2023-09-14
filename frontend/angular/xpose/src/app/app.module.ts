import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { FormsModule } from "@angular/forms";
import { AuthService } from "./shared/services/auth.service";
import { AuthGuard } from './shared/guard/auth.guard';

//firebase services and environmnet file
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { FriendListComponent } from "./friend-list/friend-list.component";

import { CreateEventPage } from "./create-event/create-event.page";

import { NgxMasonryModule } from 'ngx-masonry';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GalleryModalComponent } from "./gallery-modal/gallery-modal.component";

@NgModule({
  declarations: [
    AppComponent, 
    SidebarComponent,
    GalleryModalComponent,
    FriendListComponent] ,
  imports: [
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    NgxMasonryModule,

  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    AuthGuard /*ScreenTrackingService,UserTrackingService*/,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
