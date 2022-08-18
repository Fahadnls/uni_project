import { TestBed } from '@angular/core/testing';

import { LocationRouteService } from './location-route.service';

describe('LocationRouteService', () => {
  let service: LocationRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
