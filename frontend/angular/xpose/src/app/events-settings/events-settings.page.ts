import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ModalController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Event } from '../shared/event';
import { LocationAutocompleteService } from '../service/location-autocomplete.service';
import { Service } from '../service/service';
import { Console, error } from 'console';
import { LoadingController } from "@ionic/angular";

// interface ApiResponse {
//   message: string;
//   tagWords: string[]; // Assuming tagWords is an array of strings
// }

@Component({
  selector: 'app-events-settings',
  templateUrl: './events-settings.page.html',
  styleUrls: ['./events-settings.page.scss'],
})
export class EventsSettingsPage implements OnInit {
  eventObject: Event = {
		uid: 0,
		title: ' ',
		image: null,
		start_date: ' ',
		end_date: ' ',
		location: ' ',
		description: ' ',
		privacy_setting: 'public',
		latitude: 0,
		longitude: 0,
		image_url: ' ',
	  };
	  route: any;
	  buttonClicked = false;
	  loading = false;
	locationPredictions: any[] = [];


  restrictedWords_list: string[] = [];
  word_input: string = '';

  data: any;
  eventUID:string = "";
  
  constructor(private http: HttpClient,
		private router: Router,
		private api: ApiService,
		private modalController: ModalController,
		private afAuth: AngularFireAuth,
    private locationAutocompleteService: LocationAutocompleteService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private userService: Service,
    private loadingController: LoadingController) { }

    ngOnInit() {
      // click the element with id of posts_tab
      document.getElementById("posts_tab")?.click();

      // give messageCollection stub value
      // this.messagesCollection = this.afs.collection<Message>(`Event-Chats/0/chats`);
      this.activatedRoute.paramMap.subscribe((paramMap: any) => {
        if (!paramMap.has('id')) {
          // Redirect to home page if no event id is available
          this.navCtrl.navigateBack('/home');
          return;
        }
  
        // participants: Participants[] = [
        //   { name: 'John' },
        //   { name: 'Thabo' },
        //   { name: 'Naria' },
          // Add more participant objects as needed
        // ];
       
  
        const event_id = paramMap.get('id');
  
        console.log(`The event id = ${event_id}`);
      
        this.getCurrentUserId().subscribe((uid : any) => {
          if (uid) {
            this.eventUID =event_id;
            console.log(`${this.api.apiUrl}/e/events/${event_id}?uid=${uid}`);
            console.log(`${this.api.apiUrl}/e/feed?uid=${uid}&code=${event_id}`);
            this.http.get(`${this.api.apiUrl}/e/feed?uid=${uid}&code=${event_id}`).subscribe((data: any) => {
              this.data = data[0];
              console.log(data);
              this.eventObject = {
                uid: this.data.owner_id, // Assuming id maps to uid
                title: this.data.title,
                image: null, // You may need to adjust this depending on your data structure
                start_date: this.data.start_date,
                end_date: this.data.end_date,
                location: this.data.location,
                description: this.data.description,
                privacy_setting: this.data.privacy_setting,
                latitude: this.data.latitude,
                longitude: this.data.longitude,
                image_url: this.data.image_url,
              };
              this.selected_tags = this.data.tags;
              this.current_image_url = this.data.image_url;
              if(this.data.user_event_position !== "owner") {
                console.log("You are not the owner of this event");
                this.router.navigate(['/home']);
              }
              this.getEventParticipantsFromAPI();
            },
            (error) => {
                this.loading = false; 
                console.error(error);
            });


            // restricted words data
            this.addRestrictedWords(event_id, []);
          }

          else {
            this.loading = false; // Request completed with an error
            console.log("no user id");
          }
        });
  
        
  
        console.log('Hello from event page');
        // // make api call to ${this.api.apiUrl}/e/events/{event_id}
        // this.http.get('${this.api.apiUrl}/e/events/' + event_id).subscribe((res : any) => {
        //   console.log(res);
        //   this.event = res;
        //   // this.currentEventDataService.event_id = res._id;
        // });
      });
    }

    async removeRestrictedWord(word:string) {
      const arrayOfWords = [];
      arrayOfWords.push(word);
      this.computeRemovedWords(this.eventUID, arrayOfWords).subscribe(
        (response: any) => {
          //
          console.log("Restricted words deleted:", response);
  
          this.restrictedWords_list = response.tagWords;
          // console.log("Restricted words array:", this.restrictedWords_list);
        },
        (error) => {
          console.log("Error deleting restricted words", error)
        }
      )
    }

    computeRemovedWords(event_id: string, tagWordsArray: string[]) {      
      const formData:FormData = new FormData();
      let flag = false;
      for(let index = 0; index < tagWordsArray.length; index++) {
        flag = true;
        formData.append('restrictedWords[]',tagWordsArray[index].toLowerCase());
      }
      if(!flag){
        formData.append('restrictedWords[]', '');
      }

      return this.http.post(`${this.api.apiUrl}/c/chats/${event_id}/restrictedWord_deleted`, formData);
    }

    async addRestricted(word:string) {
      const arrayOfWords = word.split(/[ ,]+/);
      // Filter out empty strings
      const nonEmptyWords = arrayOfWords.filter(t => t.trim() !== '');
      // console.log("Restricted words before", this.restrictedWords_list);
      // Filter out words that are already in this.restrictedWords_list
      const uniqueWords = nonEmptyWords.filter(word => !this.restrictedWords_list.includes(word));
    
      this.restrictedWords_list = this.restrictedWords_list.filter(t => t !== word);
      console.log("Restricted words after", this.restrictedWords_list);
      this.addRestrictedWords(this.eventUID, uniqueWords);
  }

  async addRestrictedWords(event_id:string, tagWords: string[]) {
    this.computationOfRestrictedWords(event_id, tagWords).subscribe(
      (response: any) => {
        //
        console.log("Restricted words added:", response);

        this.restrictedWords_list = response.tagWords;
        console.log("Restricted words array:", this.restrictedWords_list);
      },
      (error) => {
        console.log("Error adding restricted words", error)
      }
    )
   }

    computationOfRestrictedWords(event_id: string, tagWordsArray: string[]) {      
      const formData:FormData = new FormData();
      let flag = false;
      for(let index = 0; index < tagWordsArray.length; index++) {
        flag = true;
        formData.append('restrictedWords[]',tagWordsArray[index].toLowerCase());
      }
      if(!flag){
        formData.append('restrictedWords[]', '');
      }

      return this.http.post(`${this.api.apiUrl}/c/chats/${event_id}/restrictedWord`, formData);
    }

    current_image_url: string = '';
  onFileSelected(event: any) {
		const file: File = event.target.files[0];
		this.eventObject.image = file;
    // this.eventObject.image_url = file.
    this.current_image_url = URL.createObjectURL(file);

	  }

    getCurrentUserId(): Observable<string> {
      return this.afAuth.authState.pipe(
        map((user) => {
        if (user) {
          return user.uid;
        } else {	
          console.log('No user is currently logged in.');
          return '';
        }
        })
      );
    }

      	// Function to fetch location predictions
	async onLocationInput(event: any) {
		console.log('Fetching location predictions...');
		try {
		this.locationPredictions = await this.locationAutocompleteService.getPlacePredictions(event.target.value);
		console.log(this.locationPredictions);
		} catch (error) {
		console.error('Error fetching location predictions:', error);
		}
	}

  deleteEvent() {
    this.getCurrentUserId().subscribe((uid) => {
      if(uid){
          const url = `${this.api.apiUrl}/e/events/${this.data.code}?uid=${uid}`;
          console.log(url);
          console.log('Deleting event...');
          this.http.delete(url)
          .subscribe({
            next: (response:any) => {
            console.log(response);
            // Handle the response from the server
            // this.router.navigate(['/home']);
            },
            error: (error) => {
            // Handle any errors that occurred during the request
            console.error(error);
            this.loading = false;
            // Display an error message to the user or perform any necessary error handling
            }
          });
      }
      else {
        console.log("No user is currently logged in.");
        // ! throw error
      }
    });
  }
    // Function to handle location selection
    onLocationSelect(prediction: any) {
      console.log('Selected location:', prediction.description);
      
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: prediction.description }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        this.eventObject.location = prediction.description;
        this.eventObject.latitude = location.lat();
        this.eventObject.longitude = location.lng();
        
        console.log('Location selected:', this.eventObject.location);
        console.log('Latitude:', this.eventObject.latitude);
        console.log('Longitude:', this.eventObject.longitude);
        } else {
        console.log('Geocoding failed due to: ' + status);
        }
      });
  
    this.locationPredictions = []; // Clear the predictions
    }

    updateEvent() {
      // if(this.createEvent.title != " " || this.createEvent.start_date != " " || this.createEvent.end_date != " " || this.createEvent.location != " " || this.createEvent.description != " " || this.createEvent.longitude != 0 || this.createEvent.latitude != 0){
        this.getCurrentUserId().subscribe((uid) => {
          if(uid){
              this.buttonClicked = true;
              this.loading = true;
    
              // this.createEvent.userId = parseInt(userId);
              const formData: FormData = new FormData();
              formData.append('uid', uid);
              formData.append('title', this.eventObject.title);
              for(let index = 0; index < this.selected_tags.length; index++) {
                console.log(`Adding tag ${this.selected_tags[index]} to form data`);
                formData.append('tags[]', this.selected_tags[index]);
              }
              
              if (this.eventObject.image) {
                formData.append('image', this.eventObject.image, this.eventObject.image.name);
              }
              
              formData.append('start_date', this.eventObject.start_date);
              formData.append('end_date', this.eventObject.end_date);
              formData.append('location', this.eventObject.location);
              formData.append('description', this.eventObject.description);
              formData.append('privacy_setting', this.eventObject.privacy_setting);
              formData.append('latitude', this.eventObject.latitude.toString());
              formData.append('longitude', this.eventObject.longitude.toString());
              console.log(formData);
              console.log(this.eventObject);
              // REfactor this to be done in the service class for better decoupling
              const url = `${this.api.apiUrl}/e/events/${this.data.code}?uid=${uid}`;
              console.log(url);
              console.log('Updating event...');
              this.http.put(url, formData)
              .subscribe({
                next: (response:any) => {
                console.log(response);
                // Handle the response from the server
                // this.router.navigate(['/home']);
                },
                error: (error) => {
                // Handle any errors that occurred during the request
                console.error(error);
                this.loading = false;
                // Display an error message to the user or perform any necessary error handling
                }
              });

              // now load participants
          }
          else {
            console.log("No user is currently logged in.");
            // ! throw error
          }
        });
      // }
      // else{
      //   console.log("Please fill in all the fields.");
      // }
      }

      tag_input: string = '';
	  tags_list: string[] = [];
	  selected_tags: string[] = [];
	  
	  onTagInput(event: any) {
		this.tag_input = event.target.value;
		this.http.get(`${this.api.apiUrl}/e/tags?q=${this.tag_input}`)
		.subscribe({
		  next: (response: any) => {
			this.tags_list = response;
		  },
		  error: (error) => {}
		});
	  }




	  onTagRemove(tag: string) {
		this.selected_tags = this.selected_tags.filter(t => t !== tag);
	  }

	  onTagSelect(tag: any) {
		console.log(`Selected tags before: ${this.selected_tags}`);
		if (!this.selected_tags.includes(tag) && tag !== '') {
			this.selected_tags.push(tag);
		}
		console.log(`Selected tags after: ${this.selected_tags}`);
		this.tags_list = [];
		this.tag_input = '';
	  }

    loading_!: HTMLIonLoadingElement;

  async  onWordRemove(word: string) {
      console.log("Restricted words before", this.restrictedWords_list);
      this.restrictedWords_list = this.restrictedWords_list.filter(t => t !== word);
      console.log("Restricted words after", this.restrictedWords_list);
      // try {
      //   this.loading_ = await this.loadingController.create({
      //     message: "please wait...",
      //   });

      //     await this.loading_.present();
            this.removeRestrictedWord(word);
         await this.loading_.dismiss();
		// } catch (error) {
		// 	await this.loading_.dismiss();
		// 	console.error("Error updating profile", error);
		// }
    }


    // search code
    user_input: string = '';
    users_list: any[] = [];
    
    onUserInput(event: any) {
      this.user_input = event.target.value;
      const search_endpoint = `${this.api.apiUrl}/u/users/search?field=uniq_username&value=${this.user_input}`;
      this.loading = true;

     this.http.get<any[]>(search_endpoint).subscribe(
       (response) => {
        console.log(response);
        this.users_list = response;
       },
       (error:any) => {
         console.log(error.error.message);
       }
     )
    }

    onUserSelect(user: any) {
      console.log(user);
    }

    inviteUser(user: any) {
      this.getCurrentUserId().subscribe((uid) => {
        this.http.post(`${this.api.apiUrl}/e/events/${this.data.code}/invite?uid=${uid}&invitee=${user.id}`, {})
        .subscribe({
          next: (response:any) => {
            console.log(response);
            // Handle the response from the server
            // this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error(error);
          }
        });
      });
      // console.log(user);
    }

    // participants code
  participants: any;
    users: any;
  
  onCardClick(participant: any) {
    console.log('Card clicked');
    console.log(participant.id);
    // this.router.navigateByUrl('/user-profile')
    // / Check if participant object and participant.id are defined and not null
    if (participant) {
      // Navigate to the user profile page with the participant's ID
      this.router.navigate(['/user-profile', participant.uid]);
    } else {
      // Handle the case where participant object or participant.id is invalid or missing
      console.error('Invalid participant data.');
      // Optionally, you can show an error message or handle the situation differently.
    }

  }



  removeParticipant(participant: any) {
    console.log(participant);
    this.getCurrentUserId().subscribe((uid) => {
      if(uid) {
        const url = `${this.api.apiUrl}/e/events/${this.data.code}/remove?uid=${uid}&participant=${participant.uid}`;
        console.log(url);
        console.log('Removing participant...');
        this.http.delete(url)
        .subscribe({
          next: (response:any) => {
          console.log(response);
          // Handle the response from the server
          // this.router.navigate(['/home']);
          },
          error: (error) => {
          // Handle any errors that occurred during the request
          console.error(error);
          this.loading = false;
          // Display an error message to the user or perform any necessary error handling
          }
        });
      }
    });
    
  }
  
  getEventParticipantsFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if(uid) {
        this.http
          .get(`${this.api.apiUrl}/e/events/${this.data.code}/participants?uid=${uid}`)
          .subscribe((data) => {
            this.participants = data;

            // this.event.participants.forEach((participant: any) => {
            //   participant.since_joining = this.formatDateSinceJoining(participant.join_date);
            // });
            this.participants.forEach((participant:any) =>{
              this.userService.GetUser(participant.uid).subscribe(
                (user) => {
                  if(user) {
                    participant.photoURL = user.photoURL;
                  }
                }
              )
            })

            console.log("Participants data:",data);
          });
      }
    });
  }
	  
	  
        
      onSubmit() {
        console.log('hit');
      }
    
      goBack(){
        this.router.navigate(["/home"]);
      }
    
      onEvent() {
      this.router.navigate(['/create-event']);
      }
    
      onNotifications() {
      this.router.navigate(['/notification']);
      }
    
      onProfile() {
      this.router.navigate(['/profile']);
      }
    
      onJoinedEvent() {
      this.router.navigate(['/joined-event']);
      }
    
      onHome() {
      this.router.navigate(['/home']);
      }
}
