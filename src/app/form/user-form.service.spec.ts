import { TestBed, inject } from '@angular/core/testing';

import { UserFormService } from './user-form.service';

describe('UserFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFormService]
    });
  });

  it('should be created', inject([UserFormService], (service: UserFormService) => {
    expect(service).toBeTruthy();
  }));
});
