import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { isSignedOutGuard } from './is-signed-out.guard';

describe('isSignedOutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isSignedOutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
