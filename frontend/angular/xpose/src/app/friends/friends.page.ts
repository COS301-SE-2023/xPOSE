import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friends: any[]; // Your list of friends data

  constructor() {
    // Initialize the friends data (you can fetch it from an API or a service)
    this.friends = [
      {
        name: 'John Doe',
        avatar: 'assets/avatar1.jpg',
        status: 'Online',
      },
      {
        name: 'Jane Smith',
        avatar: 'assets/avatar2.jpg',
        status: 'Offline',
      },
      // Add more friends here...
    ];
  }

  ngOnInit() {
  }

}

