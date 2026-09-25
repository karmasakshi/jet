import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { hasUnsavedChangesGuard } from './has-unsaved-changes.guard';

describe('hasUnsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<CanComponentDeactivate> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasUnsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
