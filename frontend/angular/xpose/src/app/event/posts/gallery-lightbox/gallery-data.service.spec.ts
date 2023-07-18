import { TestBed } from '@angular/core/testing';

import { GalleryDataService } from './gallery-data.service';

describe('GalleryDataService', () => {
  let service: GalleryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
