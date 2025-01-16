import {
  Injectable,
  Signal,
  WritableSignal,
  effect,
  inject,
  signal,
  untracked,
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
export class ServiceWorkerService {
  private readonly _swUpdate = inject(SwUpdate);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _storageService = inject(StorageService);

  private _isReloadPending: boolean;
  private readonly _lastUpdateCheckTimestamp: WritableSignal<string>;

  public readonly serviceWorkerUpdateSubscription: Subscription;

  public constructor() {
    this._isReloadPending = false;

    this._lastUpdateCheckTimestamp = signal(
      this._storageService.getLocalStorageItem<string>(
        LocalStorageKey.LastUpdateCheckTimestamp,
      ) ?? new Date().toISOString(),
    );

    this.serviceWorkerUpdateSubscription = this._subscribeToUpdates();

    effect(() => {
      const lastUpdateCheckTimestamp: string = this._lastUpdateCheckTimestamp();
      untracked(() =>
        this._storageService.setLocalStorageItem(
          LocalStorageKey.LastUpdateCheckTimestamp,
          lastUpdateCheckTimestamp,
        ),
      );
    });

    this._loggerService.logServiceInitialization('ServiceWorkerService');
  }

  public get lastUpdateCheckTimestamp(): Signal<string> {
    return this._lastUpdateCheckTimestamp.asReadonly();
  }

  public async checkForUpdate(): Promise<void> {
    if (this._isReloadPending) {
      this._alertService.showAlert(
        this._translocoService.translate('alerts.reload-to-update'),
        this._translocoService.translate('cta.reload'),
        (): void => {
          window.location.reload();
        },
      );
    } else {
      this._alertService.showAlert(
        this._translocoService.translate('alerts.checking-for-updates'),
      );

      try {
        const isUpdateFoundAndReady: boolean =
          await this._swUpdate.checkForUpdate();

        if (!isUpdateFoundAndReady) {
          this._alertService.showAlert(
            this._translocoService.translate(
              'alerts.youre-on-the-latest-version',
            ),
          );
        }
      } catch (exception: unknown) {
        if (exception instanceof Error) {
          this._loggerService.logError(exception);
          this._alertService.showErrorAlert(exception.message);
        } else {
          this._loggerService.logException(exception);
        }
      }
    }
  }

  private _subscribeToUpdates(): Subscription {
    if (!this._swUpdate.isEnabled) {
      return Subscription.EMPTY;
    }

    return this._swUpdate.versionUpdates.subscribe(
      (versionEvent: VersionEvent): void => {
        switch (versionEvent.type) {
          case 'NO_NEW_VERSION_DETECTED':
            this._lastUpdateCheckTimestamp.set(new Date().toISOString());
            break;

          case 'VERSION_DETECTED':
            this._lastUpdateCheckTimestamp.set(new Date().toISOString());
            this._alertService.showAlert(
              this._translocoService.translate('alerts.downloading-updates'),
            );
            break;

          case 'VERSION_INSTALLATION_FAILED':
            this._loggerService.logError(new Error(versionEvent.error));
            this._alertService.showErrorAlert(versionEvent.error);
            break;

          case 'VERSION_READY':
            this._isReloadPending = true;
            this._alertService.showAlert(
              this._translocoService.translate('alerts.reload-to-update'),
              this._translocoService.translate('cta.reload'),
              (): void => {
                window.location.reload();
              },
            );
            break;

          default:
            this._loggerService.logError(new Error());
            break;
        }
      },
    );
  }
}
