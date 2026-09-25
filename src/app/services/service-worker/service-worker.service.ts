import {
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  Service,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { translate } from '@jsverse/transloco';
import { AlertService } from '../alert/alert.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Service()
export class ServiceWorkerService {
  readonly #document = inject(DOCUMENT);
  readonly #destroyRef = inject(DestroyRef);
  readonly #swUpdate = inject(SwUpdate);
  readonly #alertService = inject(AlertService);
  readonly #analyticsService = inject(AnalyticsService);
  readonly #loggerService = inject(LoggerService);
  readonly #storageService = inject(StorageService);

  #isUpdateReady: boolean;
  readonly #lastUpdateCheckTimestamp: WritableSignal<string>;

  public readonly lastUpdateCheckTimestamp: Signal<string>;

  public constructor() {
    this.#isUpdateReady = false;

    const storedLastUpdateCheckTimestamp: null | string =
      this.#storageService.getLocalStorageItem<string>(LocalStorageKey.LastUpdateCheckTimestamp);

    this.#lastUpdateCheckTimestamp = signal(
      storedLastUpdateCheckTimestamp ?? new Date().toISOString(),
    );

    this.lastUpdateCheckTimestamp = this.#lastUpdateCheckTimestamp.asReadonly();

    effect(
      () => {
        this.#loggerService.logEffectRun('lastUpdateCheckTimestamp');

        const lastUpdateCheckTimestamp: string = this.#lastUpdateCheckTimestamp();

        untracked(() =>
          this.#storageService.setLocalStorageItem(
            LocalStorageKey.LastUpdateCheckTimestamp,
            lastUpdateCheckTimestamp,
          ),
        );
      },
      { debugName: 'lastUpdateCheckTimestamp' },
    );

    this.#loggerService.logServiceInitialization('ServiceWorkerService');
  }

  public async checkForUpdate(): Promise<boolean> {
    if (this.#isUpdateReady) {
      this.#alertService.showAlert(
        translate('alerts.reload-to-update'),
        translate('alerts.reload'),
        (): void => {
          this.#document.location.reload();
        },
      );

      return Promise.resolve(true);
    }

    return this.#swUpdate.checkForUpdate();
  }

  public subscribeToVersionUpdates(): void {
    this.#swUpdate.versionUpdates
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((versionEvent: VersionEvent) => {
        switch (versionEvent.type) {
          case 'NO_NEW_VERSION_DETECTED': {
            this.#analyticsService.logAnalyticsEvent({ name: 'no_new_version_detected' });

            this.#lastUpdateCheckTimestamp.set(new Date().toISOString());

            break;
          }

          case 'VERSION_DETECTED': {
            this.#analyticsService.logAnalyticsEvent({
              data: { version: versionEvent.version.hash },
              name: 'version_detected',
            });

            this.#lastUpdateCheckTimestamp.set(new Date().toISOString());

            this.#alertService.showAlert(translate('alerts.downloading-updates'));

            break;
          }

          case 'VERSION_INSTALLATION_FAILED': {
            const error = new Error(versionEvent.error);

            this.#analyticsService.logAnalyticsEvent({ name: 'version_installation_failed' });

            this.#loggerService.logException(error);

            this.#alertService.showExceptionAlert(error);

            break;
          }

          case 'VERSION_READY': {
            this.#analyticsService.logAnalyticsEvent({
              data: {
                currentVersion: versionEvent.currentVersion.hash,
                latestVersion: versionEvent.latestVersion.hash,
              },
              name: 'version_ready',
            });

            this.#isUpdateReady = true;

            this.#alertService.showAlert(
              translate('alerts.reload-to-update'),
              translate('alerts.reload'),
              (): void => {
                this.#document.location.reload();
              },
            );

            break;
          }
        }
      });
  }
}
