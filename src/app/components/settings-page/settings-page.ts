import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { COLOR_SCHEME_OPTIONS } from '@jet/constants/color-scheme-options.constant';
import { LANGUAGE_OPTIONS } from '@jet/constants/language-options.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { StorageService } from '@jet/services/storage/storage.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import packageJson from 'package.json';
import { PageComponent } from '../page/page.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    AnalyticsDirective,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-settings-page',
  styleUrl: './settings-page.scss',
  templateUrl: './settings-page.html',
})
export class SettingsPage {
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _serviceWorkerService = inject(ServiceWorkerService);
  private readonly _settingsService = inject(SettingsService);
  private readonly _storageService = inject(StorageService);
  private readonly _translocoService = inject(TranslocoService);

  private readonly _isUpdatePending: Signal<boolean>;

  public readonly colorSchemeOptions: ColorSchemeOption[];
  public readonly languageOptions: LanguageOption[];
  public readonly lastUpdateCheckTimestamp: Signal<string>;
  public readonly settings: Signal<Settings>;
  public readonly version: string;

  public constructor() {
    this._isUpdatePending = this._serviceWorkerService.isUpdatePending;

    this.colorSchemeOptions = COLOR_SCHEME_OPTIONS;

    this.languageOptions = LANGUAGE_OPTIONS;

    this.lastUpdateCheckTimestamp =
      this._serviceWorkerService.lastUpdateCheckTimestamp;

    this.settings = this._settingsService.settings;

    this.version = packageJson.version;

    this._loggerService.logComponentInitialization('SettingsPage');
  }

  public async checkForUpdate(): Promise<void> {
    if (this._isUpdatePending()) {
      this._serviceWorkerService.alertUpdateAvailability();
    } else {
      this._progressBarService.showProgressBar({ mode: 'query' });

      this._alertService.showAlert(
        this._translocoService.translate('alerts.checking-for-updates'),
      );

      try {
        const isUpdateFoundAndReady: boolean =
          await this._serviceWorkerService.checkForUpdate();

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
      } finally {
        this._progressBarService.hideProgressBar();
      }
    }
  }

  public reload(): void {
    window.location.reload();
  }

  public reset(): void {
    this._storageService.clearLocalStorage();
    this._storageService.clearSessionStorage();
    this.reload();
  }

  public updateSettings(partialSettings: Partial<Settings>): void {
    this._settingsService.updateSettings(partialSettings);
  }
}
