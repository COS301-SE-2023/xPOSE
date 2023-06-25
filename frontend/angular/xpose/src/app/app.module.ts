import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { FormsModule } from "@angular/forms";
import { AuthService } from "./shared/services/auth.service";

//firebase services and environmnet file
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule,
		IonicModule.forRoot(), 
		AppRoutingModule,
		provideFirebaseApp(() => initializeApp(environment.firebase)), 
		// provideAnalytics(() => getAnalytics()), 
		provideAuth(() => getAuth()), 
		provideDatabase(() => getDatabase()), 
		provideFirestore(() => getFirestore()), 
		// provideFunctions(() => getFunctions()), 
		// provideMessaging(() => getMessaging()), 
		// providePerformance(() => getPerformance()), 
		// provideRemoteConfig(() => getRemoteConfig()), 
		provideStorage(() => getStorage())],
	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		/*ScreenTrackingService,UserTrackingService*/],
	bootstrap: [AppComponent],
})
export class AppModule {}
