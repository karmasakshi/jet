import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { isNotAuthenticated } from './is-not-authenticated.guard';

describe('isNotAuthenticated', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isNotAuthenticated(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
