import { Component, OnInit } from '@angular/core';

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

  constructor() {
    this.participants = [];
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
