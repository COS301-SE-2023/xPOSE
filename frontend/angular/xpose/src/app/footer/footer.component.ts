import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  constructor(private router: Router, public authService: AuthService,) { }

  ngOnInit() {}

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
