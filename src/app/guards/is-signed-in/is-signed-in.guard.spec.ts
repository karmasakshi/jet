import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { isSignedInGuard } from './is-signed-in.guard';

describe('isSignedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isSignedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
