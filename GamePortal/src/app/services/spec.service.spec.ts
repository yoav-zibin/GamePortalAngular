import { TestBed, inject } from '@angular/core/testing';

import { SpecService } from './spec.service';

describe('SpecService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecService]
    });
  });

  it('should be created', inject([SpecService], (service: SpecService) => {
    expect(service).toBeTruthy();
  }));
});
