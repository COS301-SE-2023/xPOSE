import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
// import { environment } from "./environments/environment";

// if (environment.production) {
// 	enableProdMode();
// }


// service worker registration 
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('firebase-messaging-sw.js')
	  .then((registration) => {
		// Service worker registration successful
		console.log('Service worker registered:', registration);
	  })
	  .catch((err) => {
		// Service worker registration failed
		console.error('Service worker registration failed:', err);
	  });
  }
  

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.log(err));
