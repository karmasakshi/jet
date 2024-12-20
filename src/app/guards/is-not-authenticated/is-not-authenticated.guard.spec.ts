import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isNotAuthenticatedGuard } from './is-not-authenticated.guard';

describe('isNotAuthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      isNotAuthenticatedGuard(...guardParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
