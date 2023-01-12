import { TestBed } from '@angular/core/testing';

import { PantryService } from './pantry.service';

describe('ItemService', () => {
  let service: PantryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PantryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
