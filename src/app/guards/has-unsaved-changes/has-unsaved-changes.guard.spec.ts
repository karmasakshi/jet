import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { HasUnsavedChanges } from '@jet/interfaces/has-unsaved-changes.interface';
import { hasUnsavedChangesGuard } from './has-unsaved-changes.guard';

describe('hasUnsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<HasUnsavedChanges> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasUnsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
