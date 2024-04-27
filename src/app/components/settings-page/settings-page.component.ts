import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { SwUpdate } from '@angular/service-worker';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LANGUAGE_OPTIONS } from '@xxx/constants/language-options.constant';
import { STORAGE_KEYS } from '@xxx/constants/storage-keys.constant';
import { THEME_OPTIONS } from '@xxx/constants/theme-options.constant';
import { LanguageOption } from '@xxx/interfaces/language-option.interface';
import { Settings } from '@xxx/interfaces/settings.interface';
import { ThemeOption } from '@xxx/interfaces/theme-option.interface';
import { AlertService } from '@xxx/services/alert/alert.service';
import { LoggerService } from '@xxx/services/logger/logger.service';
import { SettingsService } from '@xxx/services/settings/settings.service';
import { StorageService } from '@xxx/services/storage/storage.service';
import { TitleService } from '@xxx/services/title/title.service';
import packageJson from 'package.json';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    TranslocoModule,
  ],
  providers: [DatePipe],
  selector: 'xxx-settings-page',
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
    private readonly _translocoService: TranslocoService,
    private readonly _alertService: AlertService,
    private readonly _loggerService: LoggerService,
    private readonly _settingsService: SettingsService,
    private readonly _storageService: StorageService,
    public readonly _titleService: TitleService,
  ) {
    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(xxx-settings-page.arabic)
     * t(xxx-settings-page.english)
     */

    this.languageOptions = LANGUAGE_OPTIONS;

    this.lastUpdateCheck = this._translocoService.translate(
      'xxx-settings-page.unknown',
    );

    this.settings = this._settingsService.settings;

    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(xxx-settings-page.automatic)
     * t(xxx-settings-page.dark)
     * t(xxx-settings-page.light)
     */

    this.themeOptions = THEME_OPTIONS;

    this.version = packageJson.version;

    this._titleService.setTitle(
      this._translocoService.translate('xxx-settings-page.title'),
    );

    this._loggerService.logComponentInitialization('SettingsPageComponent');
  }

  public ngOnInit(): void {
    this._updateLastUpdateCheck();
  }

  public checkForUpdate(): void {
    this._alertService.showAlert(
      this._translocoService.translate('alerts.checking-for-update'),
      this._translocoService.translate('alerts.ok-cta'),
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
            this._translocoService.translate('alerts.ok-cta'),
          );
        }
      })
      .catch((error: unknown): void => {
        this._loggerService.logError(error);

        this._alertService.showAlert(
          this._translocoService.translate('alerts.something-went-wrong'),
          this._translocoService.translate('alerts.ok-cta'),
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
      this._translocoService.translate('alerts.reload-cta'),
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
      this._translocoService.translate('alerts.reload-cta'),
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
      ) ?? this._translocoService.translate('xxx-settings-page.unknown');
  }
}
