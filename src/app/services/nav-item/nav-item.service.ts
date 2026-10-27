import { DestroyRef, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { LoggerService } from '../logger/logger.service';
import { ProgressBarService } from '../progress-bar/progress-bar.service';

@Service()
export class NavItemService {
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #loggerService = inject(LoggerService);
  readonly #alertService = inject(AlertService);

  public readonly activeNavItemPath = signal<string | undefined>(undefined);

  public constructor() {
    this.#router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationCancel ||
            event instanceof NavigationEnd ||
            event instanceof NavigationError,
        ),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.#progressBarService.showQueryProgressBar();
          return;
        }

        if (event instanceof NavigationEnd) {
          this.activeNavItemPath.set(event.url.split('?')[0]);
        }

        if (event instanceof NavigationError) {
          this.#loggerService.logException(event.error);
          this.#alertService.showExceptionAlert(event.error);
        }

        this.#progressBarService.hideProgressBar();
      });

    this.#loggerService.logServiceInitialization('NavItemService');
  }
}
