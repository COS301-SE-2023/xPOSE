import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { FormsModule } from "@angular/forms";
import { AuthService } from "./shared/services/auth.service";

//firebase services and environmnet file
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { environment } from "../environments/environments";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { CreateEventPage } from "./create-event/create-event.page";

import { NgxMasonryModule } from 'ngx-masonry';


@NgModule({
  declarations: [
    AppComponent],
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
    AuthService /*ScreenTrackingService,UserTrackingService*/,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
