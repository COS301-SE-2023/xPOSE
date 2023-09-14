import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-place-autocomplete',
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.scss'],
})
export class PlaceAutocompleteComponent  implements OnInit {

  @ViewChild("inputField")
  inputField!: ElementRef;

  @Input() placeholder: string = "Enter a location";

  autocomplete: google.maps.places.Autocomplete | undefined;


  constructor() { }

  ngOnInit() {}
  
  ngAfterViewInit() {

    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);
    this.autocomplete.addListener("place_changed", () => {
      const place = this.autocomplete?.getPlace();
      console.log(place);
    });
  }

}
