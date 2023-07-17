// gallery-data.service.ts
import { Injectable } from '@angular/core';

interface Item {
  imageSrc: string;
  imageAlt: string;
}

@Injectable({
  providedIn: 'root',
})
export class GalleryDataService {
  private data: Item[] = [];

  setData(data: Item[]) {
    this.data = data;
  }

  getData(): Item[] {
    return this.data;
  }
}
