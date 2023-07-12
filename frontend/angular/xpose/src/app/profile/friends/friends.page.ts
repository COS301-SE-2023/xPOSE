import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  userFriends: any[] = [
    {
      name: 'Lucas Murphy',
      profilePicUrl: './assets/profiles/Lucas Murphy.jpg',
      location: 'New York'
    },
    {
      name: 'Jane Smith',
      profilePicUrl: 'assets/profiles/jane-smith.jpg',
      location: 'London'
    },

    {
      name: 'Jerry James',
      profilePicUrl: 'assets/profiles/jerry-james.jpg',
      location: 'South Africa'
    },
    // Add more mock friend objects as needed
  ];

  constructor() { }
  ngOnInit() {
    // You can optionally fetch the userFriends array from your data source or API here
  }
}
