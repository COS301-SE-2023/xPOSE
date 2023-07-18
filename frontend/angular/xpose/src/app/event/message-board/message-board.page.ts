import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CurrentEventDataService } from 'src/app/shared/current-event-data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';

interface Message {
  user: string;
  message: string;
  id?: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.page.html',
  styleUrls: ['./message-board.page.scss'],
})
export class MessageBoardPage implements OnInit {
  messages: Message[] = [];
  newMessage!: string;
  event_id: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private currentEventDataService: CurrentEventDataService,
		private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.event_id = this.route.snapshot.paramMap.get('id');
    console.log("Hello it is ", this.event_id);
    // alert('Hello ' + this.event_id + '!');
  }

  createMessage() {
    if (this.newMessage) {
      // Assume 'John' is the user who typed the message, you can replace it with the actual user information.
      this.getCurrentUserId().subscribe((uid) => {
        const message: Message = {
          user: uid,
          message: this.newMessage
        };
  
        this.messages.push(message);
        this.newMessage = '';
        const event_id = this.currentEventDataService.code;
        const formData: FormData = new FormData();
        formData.append('message', message.message);

        this.http.post(`http://localhost:8000/c/chats/${event_id}?uid=${uid}`, formData).subscribe((res) => {
          console.log('Message sent successfully');
          this.messages.push(message);
        });
      });
      
    }
  }

  getCurrentUserId(): Observable<string> {
    return this.afAuth.authState.pipe(
      map((user) => {
      if (user) {
        return user.uid;
      } else {
        // throw error
        // some extra stuff
        
        console.log('No user is currently logged in.');
        return '';
      }
      })
    );
    }
}
