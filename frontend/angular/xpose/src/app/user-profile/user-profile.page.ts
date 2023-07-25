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
  user: {
    photoURL: string;
    // displayName: string;
  };

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

  applyFilter() {
    if (this.filterType === 'Events') {
      this.cards = this.events.filter((event) => event.status === 'ongoing');
    } else if (this.filterType === 'Friends') {
      this.cards = this.events.filter((event) => event.status === 'upcoming');
    }
  }

}

