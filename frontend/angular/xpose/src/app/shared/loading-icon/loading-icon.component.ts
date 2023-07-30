import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-icon',
  templateUrl: './loading-icon.component.html',
  styleUrls: ['./loading-icon.component.scss'],
})
export class LoadingPageComponent {
  isLoading: boolean = true;
}