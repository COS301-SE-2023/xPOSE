import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {
  currentPageName = '';
 	
  constructor(private router: Router, public authService: AuthService, private activatedRoute: ActivatedRoute) { }

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
	
   logout() {
    this.authService.signOut();
  }
}
