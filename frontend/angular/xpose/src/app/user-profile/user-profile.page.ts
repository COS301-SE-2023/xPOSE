import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../shared/services/auth.service";
import { Service } from '../service/service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  filterType: string = 'Events';
  events: any[] = [];
  cards: any[] = [];
  selectedTab: string = 'events';
  user: {
    photoURL: string;
  };
  tabs: any;

  constructor(
    private router: Router,
    public authService: AuthService,
    public userService: Service
  ) { 
    this.user = {
      photoURL: './assets/images/profile picture.jpg',
    };
    this.user.photoURL = './assets/images/profile picture.jpg';
  }

  ngOnInit() {
  }

  setCurrentTab() {
    this.selectedTab = this.tabs?.getSelected();
    console.log(this.selectedTab);
    this.applyFilter();
  }

  applyFilter() {
    if (this.filterType === 'Events') {
      this.cards = this.events.filter((event) => event.status === 'events');
    } else if (this.filterType === 'Friends') {
      this.cards = this.events.filter((event) => event.status === 'friends');
    }
  }
}
