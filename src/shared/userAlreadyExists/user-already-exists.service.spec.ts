import { TestBed } from '@angular/core/testing';

import { UserAlreadyExistsService } from './user-already-exists.service';

describe('UserAlreadyExistsService', () => {
  let service: UserAlreadyExistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAlreadyExistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
