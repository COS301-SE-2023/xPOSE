import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CurrentEventDataService } from 'src/app/shared/current-event-data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription, map } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';

interface Message {
  uid: string;
  displayName?: string; // Add displayName property
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
  messagesCollection: AngularFirestoreCollection<Message>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private currentEventDataService: CurrentEventDataService,
		private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    console.log(`Listening to Event-Chats/${this.currentEventDataService.code}/chats`);
    this.messagesCollection = this.afs.collection<Message>(`Event-Chats/${this.currentEventDataService.code}/chats`);
  }

  ngOnInit() {
    // retrieval initial messages from Firestore
    this.retrieveMessages();

    // Subscribe to real-time updates of the "chats" collection
    // this.messagesCollection.snapshotChanges().subscribe((actions: DocumentChangeAction<Message>[]) => {
    //   actions.forEach((action: DocumentChangeAction<Message>) => {
    //     const message = action.payload.doc.data();
    //     const messageId = action.payload.doc.id;

    //     // if (action.type === 'added') {
    //     //   // Add new message
    //     //   this.messages.push({ id: messageId, ...message });
    //     // } else if (action.type === 'modified') {
    //     //   // Update existing message
    //     //   const index = this.messages.findIndex((m) => m.id === messageId);
    //     //   if (index !== -1) {
    //     //     this.messages[index] = { id: messageId, ...message };
    //     //   }
    //     // } else if (action.type === 'removed') {
    //     //   // Remove deleted message
    //     //   const index = this.messages.findIndex((m) => m.id === messageId);
    //     //   if (index !== -1) {
    //     //     this.messages.splice(index, 1);
    //     //   }
    //     // }
    //   });
    // });
  }
  private messagesSubscription: Subscription | undefined;

  ngOnDestroy() {
    // Unsubscribe from the messages subscription to avoid memory leaks
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  createMessage() {
    if (this.newMessage) {
      this.getCurrentUserId().subscribe((uid) => {
        const message: Message = {
          uid: uid,
          message: this.newMessage
        };

        this.newMessage = '';
        const event_id = this.currentEventDataService.code;
        const formData: FormData = new FormData();
        formData.append('message', message.message);

        this.http.post(`http://localhost:8000/c/chats/${event_id}?uid=${uid}`, formData).subscribe((res) => {
          console.log('Message sent successfully');
        });
      });
    }
  }

  retrieveMessages() {
    this.messagesCollection.valueChanges().subscribe((messages: Message[]) => {
      this.messages = messages;
      
      // Fetch and assign the displayName for each message
      this.messages.forEach((message: Message) => {
        this.getUserNameFromUid(message.uid).subscribe((displayName: string) => {
          message.displayName = displayName;
        });
      });
      // console.log('Retrieving messages from Firestore...');
      // console.log(this.messages);
    });
  }
  
  getUserNameFromUid(uid: string): Observable<string> {
    return this.afs.collection('Users').doc(uid).valueChanges().pipe(
      map((user: any) => {
        if (user && user.displayName) {
          return user.displayName;
        } else {
          return 'Unknown User';
        }
      })
    );
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
