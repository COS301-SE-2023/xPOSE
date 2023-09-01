import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from '../shared/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../service/api.service';
import { NotificationRequestStrategy } from "./handle-notifications/notificationRequestStrategy";


export class NotificationHandler {
  private messages: any[] = []; 

  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService,
    private http: HttpClient,
    private api: ApiService,
    private requestStrategies: {[key: string]: NotificationRequestStrategy }
  ) {}

  listenForNotifications() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {

        const notificationsCollection = this.firestore.firestore.collection(`Notifications/${userId}/MyNotifications`).where('status', '==', 'pending');
        // add listener
        notificationsCollection.onSnapshot(
          (snapshot) => {

            // const existingMessages = this.messages;
            this.messages = [];

            snapshot.forEach((doc) =>{
              const notificationData = doc.data();
              this.messages.push(notificationData);
            });

            // sort in descending order
            this.messages.sort((a, b) => b.timestamp - a.timestamp);
            this.saveMessages();
          }, 
    
          (error) => {
            console.error("Error listening for notification:", error);
          }
        )

      }
      else {
        console.log("profile page no user id");
      }
    });
  }
  
  saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
 }

 loadMessages() {
    const storedMessages = localStorage.getItem('messages');
    this.messages = storedMessages ? JSON.parse(storedMessages) : [];
  }

  
removeNotification(message: any) {
    // Find the index of the message in the array
    const index = this.messages.indexOf(message);

    // // If the message is found in the array, remove it
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
    const notificationRef = this.firestore.collection("Notifications").doc(message.receiverId).collection("MyNotifications").doc(message.notificationId);
    // Delete the notification document
    notificationRef.delete().then(() =>{
        console.log(`Notification document with ID ${message.notificationId} successfully deleted`);
        }).catch(error =>{
            console.error(`Error deleting notification document with ID ${message.notificationId}:`, error);
        });       
}

clearMessages() {
    localStorage.removeItem('messages');
    this.messages = [];
    console.log('Messages cleared from local storage');
}

getMessages(): any[]{
    return this.messages;
}

request(user:any, request_type: string) {

    const strategy = this.requestStrategies[request_type];

    if(strategy) {
        strategy.execute(user)
        .then(() => {
            this.removeNotification(user);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }


   /* if (request_type == "accept_friendship"){
        this.friendshipAccept(user);
    }

    if(request_type == "reject_friendship"){
        this.friendshipReject(user)
    }

    if(request_type == "accept_join_event"){
        // join_event code goes here
    }

    if(request_type == "reject_join_event"){
        // reject event code goes here
    } */

  }

  // accept friendShip
  async friendshipAccept(user:any) {
        // /:userId/friend-requests/:requestId/accept'
        const endpoint = `${this.api.apiUrl}/u/users/`;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
        const requestBody = JSON.stringify(user);
        return this.http.post<any>(`${endpoint}${user.senderId}/friend-requests/${user.receiverId}/accept`, requestBody, {headers})
        .toPromise()
        .then((response) => {
          console.log("Friend request accepted",response);
          this.removeNotification(user);   
        })
        .catch((error) => {
          // Handle error response here
          window.alert(error.error.error);
          console.log("Error:", error);
          // console.log("Response body:", error.error);
          return Promise.reject(error);
        });
  }

  async friendshipReject(user:any) {
    const endpoint = `${this.api.apiUrl}/u/users/`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const requestBody = JSON.stringify(user);
    return this.http.post<any>(`${endpoint}${user.senderId}/friend-requests/${user.receiverId}/reject`, requestBody, {headers})
    .toPromise()
    .then((response) => {
      console.log("Friend request rejected",response);
      this.removeNotification(user);  
    })
    .catch((error) => {
      // Handle error response here
      console.log("Error:", error);
      // console.log("Response body:", error.error);
      return Promise.reject(error);
    });

  }

  joinEventAccept(){

  }

  joinEventReject(){

  }

}
