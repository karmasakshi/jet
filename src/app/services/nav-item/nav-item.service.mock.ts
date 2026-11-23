import { signal } from '@angular/core';

export class NavItemServiceMock {
  public readonly navItemPath = signal<string | undefined>(undefined);
}
