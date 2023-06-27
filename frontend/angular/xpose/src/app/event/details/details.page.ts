import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  qrCodeImage!: string;
  participants: any[];
  eventName!: string;
  eventDate!: Date;
  eventLocation!: string;

  constructor(private route: ActivatedRoute) {
    this.participants = [];
    
    if (!this.route.snapshot.data['event']) {
      // Redirect to home page if no event data is available
      // this.navCtrl.navigateBack('/home');
      return;
    }

    // Fetch event data based on the route parameter
    const event = this.route.snapshot.data['event'];
    // Assign the fetched data to the respective variables
    console.log(event);

    
  }

  ngOnInit() {
    this.qrCodeImage = './assets/images/your_qr_code_image.jpg';
    this.participants = [
      { name: 'John' },
      { name: 'Thabo' },
      { name: 'Naria' },
      // Add more participants as needed
    ];

    this.eventName = 'Your Event Name';
    this.eventDate = new Date();
    this.eventLocation = 'Your Event Location';
  }

  removeParticipant(participant: any) {
    const index = this.participants.indexOf(participant);
    if (index > -1) {
      this.participants.splice(index, 1);
    }
  }
}
