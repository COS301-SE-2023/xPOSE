import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  userFriends: any[] = [
    {
      name: 'John Doe',
      profilePicUrl: 'assets/images/profiles/john-doe.jpg',
      location: 'New York'
    },
    {
      name: 'Jane Smith',
      profilePicUrl: 'assets/images/profiles/jane-smith.jpg',
      location: 'London'
    },
    // Add more mock friend objects as needed
  ];

  constructor() { }

  ngOnInit() {
    // You can optionally fetch the userFriends array from your data source or API here
  }
}
