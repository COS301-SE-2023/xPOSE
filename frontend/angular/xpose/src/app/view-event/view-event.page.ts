import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit {
  isJoined: boolean = false; // Add the isJoined property

  constructor(private router: Router) { }

  ngOnInit() {
  }

  joinAndRedirect() {
    const joinButton = document.getElementById('join-button');
    if (joinButton?.classList.contains('joined')) {
      return;
    }

    if (joinButton) {
      joinButton.innerText = 'Joined';
      joinButton.classList.add('joined');
    }

    // Redirect to the home page
    this.router.navigate(['/home']);
  }

}
