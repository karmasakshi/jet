import {
  DestroyRef,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { TranslocoService } from '@jsverse/transloco';
import { AlertService } from '../alert/alert.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #swUpdate = inject(SwUpdate);
  readonly #translocoService = inject(TranslocoService);
  readonly #alertService = inject(AlertService);
  readonly #analyticsService = inject(AnalyticsService);
  readonly #loggerService = inject(LoggerService);
  readonly #storageService = inject(StorageService);

  readonly #isUpdatePending: WritableSignal<boolean>;
  readonly #lastUpdateCheckTimestamp: WritableSignal<string>;

  public constructor() {
    this.#isUpdatePending = signal(false);

    const storedLastUpdateCheckTimestamp: null | string =
      this.#storageService.getLocalStorageItem<string>(
        LocalStorageKey.LastUpdateCheckTimestamp,
      );

    this.#lastUpdateCheckTimestamp = signal(
      storedLastUpdateCheckTimestamp ?? new Date().toISOString(),
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('lastUpdateCheckTimestamp');

        const lastUpdateCheckTimestamp: string =
          this.#lastUpdateCheckTimestamp();

        untracked(() =>
          this.#storageService.setLocalStorageItem(
            LocalStorageKey.LastUpdateCheckTimestamp,
            lastUpdateCheckTimestamp,
          ),
        );
      },
      { debugName: 'lastUpdateCheckTimestamp' },
    );

    this._subscribeToVersionUpdates();

    this.#loggerService.logServiceInitialization('ServiceWorkerService');
  }

  public get isUpdatePending(): Signal<boolean> {
    return this.#isUpdatePending.asReadonly();
  }

  public get lastUpdateCheckTimestamp(): Signal<string> {
    return this.#lastUpdateCheckTimestamp.asReadonly();
  }

  public alertUpdateAvailability(): void {
    this.#alertService.showAlert(
      this.#translocoService.translate('alerts.reload-to-update'),
      this.#translocoService.translate('alert-ctas.reload'),
      (): void => {
        window.location.reload();
      },
    );
  }

  public checkForUpdate(): Promise<boolean> {
    return this.#swUpdate.checkForUpdate();
  }

  private _subscribeToVersionUpdates(): void {
    this.#swUpdate.versionUpdates
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((versionEvent: VersionEvent) => {
        switch (versionEvent.type) {
          case 'NO_NEW_VERSION_DETECTED':
            this.#lastUpdateCheckTimestamp.set(new Date().toISOString());
            this.#analyticsService.logEvent('NO_NEW_VERSION_DETECTED');
            break;

          case 'VERSION_DETECTED':
            this.#lastUpdateCheckTimestamp.set(new Date().toISOString());
            this.#analyticsService.logEvent('VERSION_DETECTED', {
              version: versionEvent.version.hash,
            });
            this.#alertService.showAlert(
              this.#translocoService.translate('alerts.downloading-updates'),
            );
            break;

          case 'VERSION_INSTALLATION_FAILED':
            this.#loggerService.logError(new Error(versionEvent.error));
            this.#analyticsService.logEvent('VERSION_INSTALLATION_FAILED');
            this.#alertService.showErrorAlert(versionEvent.error);
            break;

          case 'VERSION_READY':
            this.#isUpdatePending.set(true);
            this.#analyticsService.logEvent('VERSION_READY', {
              currentVersion: versionEvent.currentVersion.hash,
              latestVersion: versionEvent.latestVersion.hash,
            });
            this.alertUpdateAvailability();
            break;
        }
      });
  }
}
