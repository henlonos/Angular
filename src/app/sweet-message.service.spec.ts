import { TestBed } from '@angular/core/testing';

import { SweetMessageService } from './sweet-message.service';

describe('SweetMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SweetMessageService = TestBed.get(SweetMessageService);
    expect(service).toBeTruthy();
  });
});
