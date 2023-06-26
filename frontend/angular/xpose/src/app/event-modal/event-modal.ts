import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EventModal {
//   @Input() totalPrice: number | undefined;

  constructor(private modalController: ModalController, private router: Router, private location: Location) { }

  redirectToEventPage() {
    this.router.navigate(["/event"]).then(() => {
      this.location.replaceState("/event");
      window.location.reload();
    });
  }
}