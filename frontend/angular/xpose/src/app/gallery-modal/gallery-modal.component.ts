import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
// import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { ApiService } from '../service/api.service';
import { Observable, map } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Service } from '../service/service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss'],
})
export class GalleryModalComponent  implements OnInit {
  @Input() galleryData: any[] = []; // Input to receive the entire gallery data
  @Input() initialIndex: number = 0; // Input to receive the index of the clicked image

  currentIndex: number;
  previewImage = false;
  showMask = false;
  isLiked: boolean = false;
  likeCount: number = 0;
  showCommentBox: boolean = false;
  showComments: boolean = false
  // currentLightboxImage: Item = this.galleryData[0];

  constructor(
    private modalController: ModalController,
    private menuController: MenuController,
    private http: HttpClient,
    private api: ApiService,
    private afs: AngularFirestore,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: Service,
		private afAuth: AngularFireAuth
  ) {
    this.currentIndex = this.initialIndex; 
  }
  
      
  ngOnInit() {
    this.messagesCollection = this.afs.collection<Message>(`Event-Chats/${this.temp_code}/chats`);
    this.retrieveMessages();
  }
  
  toggleComment() {
    this.showCommentBox = !this.showCommentBox;
  }

  viewComments() {
    this.showComments = !this.showComments;
  }
  
  // when the component loads
  ionViewDidEnter() {
    this.currentIndex = this.initialIndex;
    console.log('Values:');
    console.log(this.galleryData);
    console.log(this.initialIndex);
  }

  closeModal() {
    this.modalController.dismiss();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.galleryData.length) % this.galleryData.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.galleryData.length;
  }
  
  toggleLike() {
    this.isLiked = !this.isLiked;

    if (this.isLiked) {
      this.likeCount++;
    } else {
      this.likeCount--;
    }
  }

  async retrieveMessages() {
    if (this.messagesCollection) {
      this.messagesCollection.snapshotChanges().subscribe((messagesSnapshot) => {
        this.messages = messagesSnapshot.map((messageSnapshot) => {
          const messageData = messageSnapshot.payload.doc.data() as Message;
          const messageId = messageSnapshot.payload.doc.id;
          const message = { ...messageData, id: messageId } as Message;
          
          this.getUserNameFromUid(message.uid).subscribe((displayName: string) => {
            message.displayName = displayName;
            // get the profile photo of the user who's messaged
            this.userService.GetUser(message.uid).subscribe((user) => {
              if (user) {
                message.photoURL = user.photoURL;
              }
            });
          });
  
          return message;
        });
  
        // Sort the messages
        this.messages.sort((a: Message, b: Message) => {
          const timestampA = a.timestamp ? a.timestamp.toMillis() : 0;
          const timestampB = b.timestamp ? b.timestamp.toMillis() : 0;
          return timestampB - timestampA;
        });
        
        // ...
      });
    } else {
      console.log("messagesCollection is undefined");
    }
  }
  
  user_id: string = '';

  async usersInImage() {
    await this.menuController.close('end');

    const usersInImageArray = this.galleryData[this.currentIndex].users_in_image;
    
    let nameOfUserInImage: string = ''; // Initialize an empty string for concatenation
    let completedRequests = 0; // Counter for completed requests
    let flag = false;
    for (const uid of usersInImageArray) {
      flag = true;
      this.getUserNameFromUid(uid).subscribe(
        (userName: string) => {
          completedRequests++;
          nameOfUserInImage += userName + `\n`; // Concatenate the usernames in image
          
          if (completedRequests === usersInImageArray.length) {
            // All requests have completed, open the modal with the concatenated usernames
            this.openModalUser("Users in image:\n" + (nameOfUserInImage || 'No user(s) detected'));
          }
        },
        (error: any) => {
          completedRequests++;
          console.error('Error fetching user name:', error);
          
          if (completedRequests === usersInImageArray.length) {
            // All requests have completed, open the modal with the concatenated usernames
            this.openModalUser("Users in image:\n" + 'No user(s) detected');
          }
        }
        );
    }
    

    if(!flag){
      this.openModalUser("Users in image:\n" +  ('No user(s) detected'));
    }
    
    // iterate through users_in_image array and display each uid using getUserNameFromUid(uid)
    
    /*let nameOfUserInImage: string | null = null;
    this.getUserNameFromUid(this.galleryData[this.currentIndex].users_in_image[0]).subscribe(
      (userName: string) => {
        nameOfUserInImage = userName; // Set the value when it's available
        console.log("Users in image", nameOfUserInImage);
        // alert('Users in image:\n' + nameOfUserInImage);
        this.openModalUser("Users in image:\n"+ (nameOfUserInImage));
      },
      (error: any) => {
        console.error('Error fetching user name:', error);
        nameOfUserInImage = 'Unknown User'; // Handle the error case
      }
    );*/
  }
  
  openModalUser(content: any) {
    let modal = document.getElementById("myModal");
    let closeImageOverlay = document.getElementById("end");
    let modalContent = document.getElementById("modalContent");
    if(modal) { 
      modal.style.display = "block";
    }
    if(modalContent) {
      modalContent.textContent = content;
    }
    
  }

  // Chat functionality
  messagesCollection: AngularFirestoreCollection<Message> | undefined;
  messages: Message[] = [];
  temp_code = '4ace835e-5efd-4be5-8108-2b4c5aee1ba0';
  
  generateAvatar(photoURL: string | undefined): string {
    // const initials = this.getInitials(name);
    // const color = this.getRandomColor();

    // You can customize the avatar appearance (size, font size, background color) here
  //   const avatarUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Crect width='100' height='100' fill='${color}'/%3E%3Ctext x='50' y='55' font-size='48' fill='white' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif'%3E${initials}%3C/text%3E%3C/svg%3E`;
    
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(avatarUrl);
  // }
  
  // Function to get the initials from a name
  // console.log("Testing displayname", displayName);
  const defaultAvatarUrl = 'path/to/default/avatar.jpg';
  return photoURL ? photoURL : defaultAvatarUrl;
  }

  closeModalUser() {
    var modal = document.getElementById("myModal");
    let closeImageOverlay = document.getElementById("end");
    if(modal) modal.style.display = "none";
  }
  
  getUserNameFromUid(uid: string): Observable<string> {
    return this.afs.collection('Users').doc(uid).valueChanges().pipe(
      map((user: any) => {
        if (user && user.displayName) {
          return user.displayName;
        } else { 
          return 'No user(s) detected'; 
        }
      })
    );
  }

  toDate(firebase_timestamp:  firebase.default.firestore.Timestamp | undefined) {
    if(firebase_timestamp !== undefined) {
     return firebase_timestamp.toDate();
    }
    return '';
  }

  newMessage!: string;
  
  async createMessage() {  
    // first check if  pre-set banned words are active


    if (this.newMessage) {
      this.getCurrentUserId().subscribe((uid) => {
        const message: Message = {
          uid: uid,
          message: this.newMessage
        };

        this.newMessage = '';
        const event_id = this.temp_code;
        const formData: FormData = new FormData();
        formData.append('message', message.message);
        this.http.post(`${this.api.apiUrl}/c/chats/${event_id}?uid=${uid}`, formData).subscribe((res) => {
          console.log(res);
        });
      });
    }
  }
  

  
  deleteMessage(messageUID: any){
    // console.log("Deleting message...",messageUID);
    this.getCurrentUserId().subscribe((uid) => {
      if(uid) {
        this.http.post(`${this.api.apiUrl}/c/chats/${this.temp_code}/message_delete/${messageUID.id}?uid=${uid}`,{}).subscribe((res) => {
          // console.log(res);
        });
      }
    });
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




  downloadImage() {
    console.log("Downloading the picture....");
    const imageSrc = this.galleryData[this.currentIndex].imageSrc;
  
    // Create an anchor element for the download
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = 'image.jpg'; // Set the desired file name here
    a.style.display = 'none';
  
    // Attach the anchor to the DOM
    document.body.appendChild(a);
  
    // Trigger the download
    a.click();
  
    // Clean up
    document.body.removeChild(a);
  }

  viewFullImage() {
    this.router.navigate(['view-image']);
    this.modalController.dismiss();
  }
  
deleteImage() {
  const item = this.galleryData[this.currentIndex];


  // Get the current image ID or reference
  // const imageId = this.galleryData[this.currentIndex].id;
  // console.log(this.galleryData[this.currentIndex]);

  // Use the appropriate method to delete the image
  // For example, if you are using Firebase, you can use the following code:
  // firebase.storage().ref().child(imageId).delete()
    // .then(() => {
    //   console.log('Image deleted successfully');
    // })
    // .catch((error) => {
    //   console.error('Error deleting image:', error);
    // });
    const url = `${this.api.apiUrl}/posts/${item.event_id}/${item.id}`
    this.http.delete(url).subscribe((res) => {
      console.log(url);
      this.onClosePreview();
    });
}
onClosePreview(){
  this.previewImage = false;
  this.showMask = false;
}


shareImage(imageUrl: string) {
  // Assuming imageUrl is the URL of the current image you want to share

  // Check if the Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: 'Check out this image!',
      text: 'I found this image and wanted to share it with you.',
      url: imageUrl,
    })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
  } else {
    // Fallback code for browsers that don't support Web Share API
    // You could open a new window with a sharing URL, or display a sharing dialog
    // specific to your application.
    // For example, using a library like SweetAlert for a custom sharing dialog.
    // You can replace this with your own logic.
    alert('To share this image, copy and paste the URL: ' + imageUrl);
  }
}



  openContextMenu() {
    this.menuController.enable(true, 'imageMenu');
    this.menuController.open('imageMenu');
  }

  comments: string[] = [];
  newComment: string = '';

  addComment() {
    if (this.newComment.trim() !== '') {
      this.comments.push(this.newComment);
      this.newComment = '';
    }
  }
}

interface Message {
  uid: string;
  displayName?: string; // Add displayName property
  message: string;
  id?: string;
  timestamp?: firebase.default.firestore.Timestamp;
  photoURL?:string;
}
