import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
})
export class ImageViewComponent implements OnInit {
  index!: number; // Initialize index property

  _albums: any[] = []; // Initialize _albums property with the appropriate type

  constructor(private route: ActivatedRoute, private _lightbox: Lightbox) {}

  ngOnInit() {
   // Subscribe to the paramMap to get the 'index' parameter
   this.route.paramMap.subscribe((params) => {
    // Perform a null check on 'params' before accessing it
    if (params.has('index')) {
      this.index = +params.get('index')!;
    }
  });
  }

  closeLightbox(): void {
    // Implement closeLightbox logic here
    this._lightbox.close();
  }

  navigateLightbox(index: number): void {
    // Implement navigateLightbox logic here
    window.location.hash = `lightbox-image-${index}`;
  }

  prevIndex(index: number): number {
    // Implement prevIndex logic here
    return (index - 1 + this._albums.length) % this._albums.length;
  }

  nextIndex(index: number): number {
    // Implement nextIndex logic here
    return (index + 1) % this._albums.length;
  }

  // ... Rest of the component code ...
}
