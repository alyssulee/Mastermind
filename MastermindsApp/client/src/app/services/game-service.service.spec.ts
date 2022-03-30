import { TestBed } from '@angular/core/testing';

import { GameServiceService } from './game-service.service';

describe('GameServiceService', () => {
  let service: GameServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
