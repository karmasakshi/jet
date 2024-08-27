import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly _swUpdate = inject(SwUpdate);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _storageService = inject(StorageService);

  private _isReloadPending: boolean;
  private readonly _lastUpdateCheckTimestamp: WritableSignal<string>;

  public readonly swUpdateSubscription: Subscription;

  public constructor() {
    this._isReloadPending = false;

    this._lastUpdateCheckTimestamp = signal(
      this._storageService.getLocalStorageItem<string>(
        LocalStorageKey.LastUpdateCheckTimestamp,
      ) ?? new Date().toISOString(),
    );

    this.swUpdateSubscription = this._subscribeToUpdates();

    this._loggerService.logServiceInitialization('UpdateService');
  }

  public get lastUpdateCheckTimestamp(): Signal<string> {
    return this._lastUpdateCheckTimestamp.asReadonly();
  }

  public checkForUpdate(): void {
    if (this._isReloadPending) {
      this._alertService.showAlert(
        this._translocoService.translate('alerts.reload-to-update'),
        this._translocoService.translate('alerts.reload'),
        (): void => {
          window.location.reload();
        },
      );
    } else {
      this._alertService.showAlert(
        this._translocoService.translate('alerts.checking-for-updates'),
        this._translocoService.translate('alerts.ok'),
      );

      this._swUpdate
        .checkForUpdate()
        .then((isUpdateFoundAndReady: boolean): void => {
          this._resetLastUpdateCheckTimestamp();
          if (!isUpdateFoundAndReady) {
            this._alertService.showAlert(
              this._translocoService.translate('alerts.no-update-found'),
              this._translocoService.translate('alerts.ok'),
            );
          }
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);
          this._alertService.showAlert(
            error.message ??
              this._translocoService.translate('alerts.something-went-wrong'),
            this._translocoService.translate('alerts.ok'),
          );
        });
    }
  }

  private _resetLastUpdateCheckTimestamp(): void {
    const now: string = new Date().toISOString();

    this._storageService.setLocalStorageItem(
      LocalStorageKey.LastUpdateCheckTimestamp,
      now,
    );

    this._lastUpdateCheckTimestamp.set(now);
  }

  private _subscribeToUpdates(): Subscription {
    if (!this._swUpdate.isEnabled) {
      return Subscription.EMPTY;
    } else {
      return this._swUpdate.versionUpdates.subscribe(
        (versionEvent: VersionEvent): void => {
          switch (versionEvent.type) {
            case 'NO_NEW_VERSION_DETECTED':
              this._resetLastUpdateCheckTimestamp();
              break;

            case 'VERSION_DETECTED':
              this._resetLastUpdateCheckTimestamp();
              this._alertService.showAlert(
                this._translocoService.translate('alerts.downloading-updates'),
                this._translocoService.translate('alerts.ok'),
              );
              break;

            case 'VERSION_INSTALLATION_FAILED':
              this._alertService.showAlert(
                this._translocoService.translate('alerts.updating-failed'),
                this._translocoService.translate('alerts.ok'),
              );
              break;

            case 'VERSION_READY':
              this._isReloadPending = true;
              this._alertService.showAlert(
                this._translocoService.translate('alerts.reload-to-update'),
                this._translocoService.translate('alerts.reload'),
                (): void => {
                  window.location.reload();
                },
              );
              break;
          }
        },
      );
    }
  }
}
