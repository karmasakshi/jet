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
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _swUpdate = inject(SwUpdate);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _alertService = inject(AlertService);
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _storageService = inject(StorageService);

  private readonly _isUpdatePending: WritableSignal<boolean>;
  private readonly _lastUpdateCheckTimestamp: WritableSignal<string>;

  public constructor() {
    this._isUpdatePending = signal(false);

    this._lastUpdateCheckTimestamp = signal(
      this._storageService.getLocalStorageItem<string>(
        LocalStorageKey.LastUpdateCheckTimestamp,
      ) ?? new Date().toISOString(),
    );

    effect(
      () => {
        this._loggerService.logEffectRun('_lastUpdateCheckTimestamp');

        const lastUpdateCheckTimestamp: string =
          this._lastUpdateCheckTimestamp();

        untracked(() =>
          this._storageService.setLocalStorageItem(
            LocalStorageKey.LastUpdateCheckTimestamp,
            lastUpdateCheckTimestamp,
          ),
        );
      },
      { debugName: '_lastUpdateCheckTimestamp' },
    );

    this._loggerService.logServiceInitialization('ServiceWorkerService');
  }

  public get isUpdatePending(): Signal<boolean> {
    return this._isUpdatePending.asReadonly();
  }

  public get lastUpdateCheckTimestamp(): Signal<string> {
    return this._lastUpdateCheckTimestamp.asReadonly();
  }

  public alertUpdateAvailability(): void {
    this._alertService.showAlert(
      this._translocoService.translate('alerts.reload-to-update'),
      this._translocoService.translate('alert-ctas.reload'),
      (): void => {
        window.location.reload();
      },
    );
  }

  public checkForUpdate(): Promise<boolean> {
    return this._swUpdate.checkForUpdate();
  }

  public subscribeToVersionUpdates(): void {
    this._swUpdate.versionUpdates
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((versionEvent: VersionEvent): void => {
        switch (versionEvent.type) {
          case 'NO_NEW_VERSION_DETECTED':
            this._lastUpdateCheckTimestamp.set(new Date().toISOString());
            this._analyticsService.logEvent('SW: NO_NEW_VERSION_DETECTED');
            break;

          case 'VERSION_DETECTED':
            this._lastUpdateCheckTimestamp.set(new Date().toISOString());
            this._analyticsService.logEvent('SW: VERSION_DETECTED');
            this._alertService.showAlert(
              this._translocoService.translate('alerts.downloading-updates'),
            );
            break;

          case 'VERSION_INSTALLATION_FAILED':
            this._loggerService.logError(new Error(versionEvent.error));
            this._analyticsService.logEvent('SW: VERSION_INSTALLATION_FAILED');
            this._alertService.showErrorAlert(versionEvent.error);
            break;

          case 'VERSION_READY':
            this._isUpdatePending.set(true);
            this._analyticsService.logEvent('SW: VERSION_READY');
            this.alertUpdateAvailability();
            break;
        }
      });
  }
}
