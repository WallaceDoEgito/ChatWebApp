import { TestBed } from '@angular/core/testing';

import { SignalConnectService } from './signal-connect.service';

describe('SignalConnectService', () => {
  let service: SignalConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
