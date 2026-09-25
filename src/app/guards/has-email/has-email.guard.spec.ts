import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { hasEmailGuard } from './has-email.guard';

describe('hasEmailGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasEmailGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
