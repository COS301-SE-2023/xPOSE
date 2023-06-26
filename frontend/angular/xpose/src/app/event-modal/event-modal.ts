import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EventModal {
//   @Input() totalPrice: number | undefined;

  constructor(private modalController: ModalController, private router: Router) { }

  redirectToEventPage() {
		this.router.navigate(['./event']);
	  }
}