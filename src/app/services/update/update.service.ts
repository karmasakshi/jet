import { Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { STORAGE_KEYS } from '@jet/constants/storage-keys.constant';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  public readonly swUpdateSubscription$: Subscription;
  public readonly lastUpdateCheckTimestamp$: Observable<string>;

  private _isReloadPending: boolean;
  private readonly _lastUpdateCheckTimestampSubject$: BehaviorSubject<string>;

  public constructor(
    private readonly _swUpdate: SwUpdate,
    private readonly _translocoService: TranslocoService,
    private readonly _alertService: AlertService,
    private readonly _loggerService: LoggerService,
    private readonly _storageService: StorageService,
  ) {
    this.swUpdateSubscription$ = this._subscribeToUpdates();

    this._isReloadPending = false;

    this._lastUpdateCheckTimestampSubject$ = new BehaviorSubject<string>(
      this._storageService.getLocalStorageItem(
        STORAGE_KEYS.LAST_UPDATE_CHECK_TIMESTAMP,
      ) ?? new Date().toISOString(),
    );

    this.lastUpdateCheckTimestamp$ =
      this._lastUpdateCheckTimestampSubject$.asObservable();

    this._loggerService.logServiceInitialization('UpdateService');
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
        this._translocoService.translate('alerts.checking-for-update'),
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
                this._translocoService.translate('alerts.downloading-update'),
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

  private _resetLastUpdateCheckTimestamp(): void {
    const now: string = new Date().toISOString();

    this._storageService.setLocalStorageItem(
      STORAGE_KEYS.LAST_UPDATE_CHECK_TIMESTAMP,
      now,
    );

    this._lastUpdateCheckTimestampSubject$.next(now);
  }
}
