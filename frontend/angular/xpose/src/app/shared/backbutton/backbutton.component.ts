import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-backbutton',
  templateUrl: './backbutton.component.html',
  styleUrls: ['./backbutton.component.scss'],
})
export class BackbuttonComponent  implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {}
  
  goBack() {
    this.location.back();
  }

  canGoBack(): boolean {
    return this.location.getState() !== undefined;
  }
}
