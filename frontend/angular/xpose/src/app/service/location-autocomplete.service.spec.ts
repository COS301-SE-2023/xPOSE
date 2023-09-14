import { TestBed } from '@angular/core/testing';

import { LocationAutocompleteService } from './location-autocomplete.service';

describe('LocationAutocompleteService', () => {
  let service: LocationAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
