import { TestBed } from '@angular/core/testing';

import { CurrentEventDataService } from './current-event-data.service';

describe('CurrentEventDataService', () => {
  let service: CurrentEventDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentEventDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
