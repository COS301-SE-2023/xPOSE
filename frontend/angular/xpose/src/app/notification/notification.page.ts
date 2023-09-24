import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from '../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../service/api.service';
import { NotificationHandler } from './notificationHandler';
import { AcceptFriendshipStrategy } from './handle-notifications/acceptFriendshipStrategy';
import { RejectFriendshipStrategy } from './handle-notifications/rejectFriendshipStrategy';
import { AcceptJoinEventStrategy } from './handle-notifications/AcceptJoinEventStrategy';
import { RejectJoinEventStrategy } from './handle-notifications/RejectJoinEventStrategy';
import { PostNotificationStrategy } from './handle-notifications/PostNotificationStrategy';
import { ReplyToEventInvitationStrategy } from './handle-notifications/replyToInvitationStrategy';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  private history: string[] = [];
  title = '';
  // messages: any[] = []; 
  strategies: {};

  // notification handler object
  private notificationHandler: NotificationHandler;

  constructor(private router: Router,
     private location: Location,
     private firestore: AngularFirestore,
     public authService: AuthService,
     private http: HttpClient,
     private api: ApiService) { 


    // Notifications strategies
    const accept_friendship_strategy = new AcceptFriendshipStrategy(api, http);
    const reject_friendship_strategy =  new RejectFriendshipStrategy(api, http);
    const accept_join_event_strategy =  new AcceptJoinEventStrategy(api, http);
    const reject_join_event_Strategy =  new RejectJoinEventStrategy(api, http);
    const post_notification_strategy =  new PostNotificationStrategy(api, http);
    const reply_to_invitation_strategy =  new ReplyToEventInvitationStrategy(api, http);

    this.strategies = {
      "accept_friendship": accept_friendship_strategy,
      "reject_friendship": reject_friendship_strategy,
      "accept_join_event": accept_join_event_strategy,
      "reject_join_event": reject_join_event_Strategy,
      "post_notifications": post_notification_strategy,
      "invitation_to_event": reply_to_invitation_strategy
    }
    
    this.notificationHandler = new NotificationHandler(firestore, authService, http, api, this.strategies);
    this.notificationHandler.listenForNotifications();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
   this.notificationHandler.loadMessages();
  }

  get messages(): any[] {
    return this.notificationHandler.getMessages();
  }
  
  request(user:any, request_type: string, response: string | null = null) {
    if (response) {
      user.response = response;
    }
    this.notificationHandler.request(user, request_type);
  }

  back(): void {
    this.history.pop();
    if (this.history.length >= 0) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }

  clearNotification(message: any) {
    this.notificationHandler.removeNotification(message);
  }
  
  search() {
		this.router.navigateByUrl('/search');
	}
	
	eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
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

  viewReport() {
    // Handle view report logic here
  }
}
