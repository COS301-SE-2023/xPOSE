import { Component, OnInit } from "@angular/core";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuController } from "@ionic/angular";
import { AuthService } from "./shared/services/auth.service";
@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
	})
export class AppComponent implements OnInit {
	currentPageName = '';
	activatedRoute: any;
	constructor(
		private router: Router,
		private menuController: MenuController,
		public authService: AuthService,
	) {
		defineCustomElements(window);

	}

	ngOnInit() {
		this.router.events
		  .pipe(filter((event) => event instanceof NavigationEnd))
		  .subscribe(() => {
			let route = this.activatedRoute;
			while (route.firstChild) {
			  route = route.firstChild;
			}
	
			this.currentPageName = this.getPageTitle(route);
		  });
	  }

	  private getPageTitle(route: ActivatedRoute): string {
		if (route.snapshot.data['title']) {
		  return route.snapshot.data['title'];
		} else if (route.firstChild) {
		  return this.getPageTitle(route.firstChild);
		} else {
		  return '';
		}
	  }

	  onMenuItemClick() {
		// Close the menu
		this.menuController.close();
	  }  
	// getPageTitle(route: any): string {
	// 	throw new Error("Method not implemented.");
	// }

		viewEvent() {
		this.router.navigate(['/event']);
		}
	
		  onEvent(){
			this.router.navigate(['/create-event']);
		}
	
		onNotifications(){
			this.router.navigate(['/notification']);
		}
		
		onProfile(){
			this.router.navigate(['/profile']);
		}  
	
		onJoinedEvent(){
			this.router.navigate(['/joined-event']);
		}
	
		onHome(){
			this.router.navigate(['/home']);
		}
	
		onSettings(){
			this.router.navigate(['/settings']);
		}
		
	  onFriends() {
		this.router.navigate(['/friends']);
	  }
	  logout() {
		this.authService.signOut();
	  }
	  onHelp() {
		this.router.navigate(['/help']);
	  }
	  onMypictures() {
		this.router.navigate(['/myimages']);
	  }
	  
}
