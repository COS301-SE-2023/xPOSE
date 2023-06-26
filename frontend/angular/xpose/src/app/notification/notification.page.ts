import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  constructor(private router: Router, private navCtrl: NavController) {}

  ngOnInit() {}

  goBack() {
    this.navCtrl.back(); // or use specific navigation method like this.navCtrl.navigateBack('previous-page');
  }

  acceptRequest() {
    // Handle accept request logic here
  }

  rejectRequest() {
    // Handle reject request logic here
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

  rejectInvitation() {
    // Handle reject invitation logic here
  }

  acceptInvitation() {
    // Handle accept invitation logic here
  }

  viewReport() {
    // Handle view report logic here
  }
}
