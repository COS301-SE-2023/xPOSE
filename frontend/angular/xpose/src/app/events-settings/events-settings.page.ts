import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Event } from '../shared/event';

@Component({
  selector: 'app-events-settings',
  templateUrl: './events-settings.page.html',
  styleUrls: ['./events-settings.page.scss'],
})
export class EventsSettingsPage implements OnInit {
  createEvent: Event = {
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
		
	  };
	  route: any;
	  buttonClicked = false;
	  loading = false;

  constructor(private http: HttpClient,
		private router: Router,
		private api: ApiService,
		private modalController: ModalController,
		private afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  onFileSelected(event: any) {
		const file: File = event.target.files[0];
		this.createEvent.image = file;
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

      CreateEvent(form: NgForm) {
        const formData: FormData = new FormData();
        formData.append('title', this.createEvent.title);
        formData.append('start_date', this.createEvent.start_date);
        formData.append('end_date', this.createEvent.end_date);
        formData.append('location', this.createEvent.location);
        formData.append('description', this.createEvent.description);
        formData.append('privacy_setting', this.createEvent.privacy_setting);
        formData.append('latitude', this.createEvent.latitude.toString());
        formData.append('longitude', this.createEvent.longitude.toString());
        if(this.createEvent.title != " " || this.createEvent.start_date != " " || this.createEvent.end_date != " " || this.createEvent.location != " " || this.createEvent.description != " " || this.createEvent.longitude != 0 || this.createEvent.latitude != 0){
          this.getCurrentUserId().subscribe((uid) => {
            if(uid){
              this.buttonClicked = true;
              this.loading = true;
              const geocoder = new google.maps.Geocoder();
              const location = new google.maps.LatLng(
                this.createEvent.latitude,
                this.createEvent.longitude
              );
      
              geocoder.geocode({ location }, (results, status) => {
                if (status === 'OK') {
                if (results[0]) {
                  this.createEvent.location = results[0].formatted_address;
                  console.log(results[0].formatted_address);
                } else {
                  console.log('No results found');
                }
                } else {
                console.log('Geocoder failed due to: ' + status);
                }
      
                // this.createEvent.userId = parseInt(userId);
                const formData: FormData = new FormData();
                formData.append('uid', uid);
                formData.append('title', this.createEvent.title);
                if (this.createEvent.image) {
                formData.append('image', this.createEvent.image, this.createEvent.image.name);
                }
                formData.append('start_date', this.createEvent.start_date);
                formData.append('end_date', this.createEvent.end_date);
                formData.append('location', this.createEvent.location);
                formData.append('description', this.createEvent.description);
                formData.append('privacy_setting', this.createEvent.privacy_setting);
                formData.append('latitude', this.createEvent.latitude.toString());
                formData.append('longitude', this.createEvent.longitude.toString());
              //   console.log(formData);
                console.log(this.createEvent);
                // REfactor this to be done in the service class for better decoupling
                const url = `${this.api.apiUrl}/e/events?uid=${uid}`;
              });
            }
            else {
              console.log("No user is currently logged in.");
              // ! throw error
            }
          });
        }
        else{
          console.log("Please fill in all the fields.");
        }
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
