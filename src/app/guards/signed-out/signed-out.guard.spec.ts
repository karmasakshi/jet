import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { signedOutGuard } from './signed-out.guard';

describe('signedOutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => signedOutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
