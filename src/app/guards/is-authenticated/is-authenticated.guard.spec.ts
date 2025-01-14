import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { isAuthenticated } from './is-authenticated.guard';

describe('isAuthenticated', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isAuthenticated(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
