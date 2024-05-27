import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { SwUpdate } from '@angular/service-worker';
import { LANGUAGE_OPTIONS } from '@jet/constants/language-options.constant';
import { STORAGE_KEYS } from '@jet/constants/storage-keys.constant';
import { THEME_OPTIONS } from '@jet/constants/theme-options.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { ThemeOption } from '@jet/interfaces/theme-option.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { StorageService } from '@jet/services/storage/storage.service';
import { TitleService } from '@jet/services/title/title.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import packageJson from 'package.json';

@Component({
  imports: [
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    AnalyticsDirective,
    TranslocoModule,
  ],
  providers: [DatePipe],
  selector: 'jet-settings-page',
  standalone: true,
  styleUrl: './settings-page.component.scss',
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent implements OnInit {
  public languageOptions: LanguageOption[];
  public lastUpdateCheck: string;
  public settings: Settings;
  public themeOptions: ThemeOption[];
  public version: string;

  public constructor(
    private readonly _datePipe: DatePipe,
    private readonly _swUpdate: SwUpdate,
    private readonly _alertService: AlertService,
    private readonly _loggerService: LoggerService,
    private readonly _settingsService: SettingsService,
    private readonly _storageService: StorageService,
    public readonly _titleService: TitleService,
    private readonly _translocoService: TranslocoService,
  ) {
    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(jet-settings-page.arabic)
     * t(jet-settings-page.english)
     */

    this.languageOptions = LANGUAGE_OPTIONS;

    this.lastUpdateCheck = this._translocoService.translate(
      'jet-settings-page.unknown',
    );

    this.settings = this._settingsService.settings;

    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(jet-settings-page.automatic)
     * t(jet-settings-page.dark)
     * t(jet-settings-page.light)
     */

    this.themeOptions = THEME_OPTIONS;

    this.version = packageJson.version;

    this._titleService.setTitle(
      this._translocoService.translate('jet-settings-page.title'),
    );

    this._loggerService.logComponentInitialization('SettingsPageComponent');
  }

  public ngOnInit(): void {
    this._updateLastUpdateCheck();
  }

  public checkForUpdate(): void {
    this._alertService.showAlert(
      this._translocoService.translate('alerts.checking-for-update'),
      this._translocoService.translate('alerts.ok'),
    );

    this._swUpdate
      .checkForUpdate()
      .then((isUpdateFoundAndReady: boolean): void => {
        this._storageService.setLocalStorageItem(
          STORAGE_KEYS.LAST_UPDATE_CHECK_TIMESTAMP,
          new Date().toISOString(),
        );
        this._updateLastUpdateCheck();

        if (!isUpdateFoundAndReady) {
          this._alertService.showAlert(
            this._translocoService.translate('alerts.no-update-found'),
            this._translocoService.translate('alerts.ok'),
          );
        }
      })
      .catch((error: unknown): void => {
        this._loggerService.logError(error);

        this._alertService.showAlert(
          this._translocoService.translate('alerts.something-went-wrong'),
          this._translocoService.translate('alerts.ok'),
        );
      });
  }

  public reload(): void {
    location.reload();
  }

  public reset(): void {
    this._storageService.clearLocalStorage();
    this._storageService.clearSessionStorage();
    this.reload();
  }

  public setLanguage(languageOption: LanguageOption): void {
    this._settingsService.storeAndUpdateSettings({
      languageOption,
    });

    this._alertService.showAlert(
      this._translocoService.translate('alerts.reload-to-apply'),
      this._translocoService.translate('alerts.reload'),
      (): void => {
        this.reload();
      },
    );
  }

  public setTheme(themeOption: ThemeOption): void {
    this._settingsService.storeAndUpdateSettings({
      themeOption,
    });

    this._alertService.showAlert(
      this._translocoService.translate('alerts.reload-to-apply'),
      this._translocoService.translate('alerts.reload'),
      (): void => {
        this.reload();
      },
    );
  }

  private _updateLastUpdateCheck(): void {
    this.lastUpdateCheck =
      this._datePipe.transform(
        this._storageService.getLocalStorageItem(
          STORAGE_KEYS.LAST_UPDATE_CHECK_TIMESTAMP,
        ),
        'medium',
      ) ?? this._translocoService.translate('jet-settings-page.unknown');
  }
}
