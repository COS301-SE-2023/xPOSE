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
 	longitude: number = 0;
	latitude: number = 0;

	
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
		console.log('Your location is:', this.getCurrentLocation());
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
  async getCurrentLocation() {
	console.log('Getting your location...')
    if ('geolocation' in navigator) {
		console.log('Geolocation is available');
    navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
		  console.log(`Latitude: ${this.latitude} Longitude: ${this.longitude}`);
		  // Use geoencoder to get address from coordinates
		  
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not available in this browser.');
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
