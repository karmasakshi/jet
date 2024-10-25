import { DatePipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { LANGUAGE_OPTIONS } from '@jet/constants/language-options.constant';
import { THEME_OPTIONS } from '@jet/constants/theme-options.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { ThemeOption } from '@jet/interfaces/theme-option.interface';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { StorageService } from '@jet/services/storage/storage.service';
import { TranslocoModule } from '@jsverse/transloco';
import packageJson from 'package.json';
import { PageComponent } from '../page/page.component';

@Component({
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
  standalone: true,
  styleUrl: './settings-page.component.scss',
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {
  private readonly _loggerService = inject(LoggerService);
  private readonly _settingsService = inject(SettingsService);
  private readonly _storageService = inject(StorageService);
  private readonly _serviceWorkerService = inject(ServiceWorkerService);

  public readonly languageOptions: LanguageOption[];
  public readonly lastUpdateCheckTimestamp: Signal<string>;
  public readonly settings: Signal<Settings>;
  public readonly themeOptions: ThemeOption[];
  public readonly version: string;

  public constructor() {
    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(jet-settings-page.arabic)
     * t(jet-settings-page.english)
     */

    this.languageOptions = LANGUAGE_OPTIONS;

    this.lastUpdateCheckTimestamp =
      this._serviceWorkerService.lastUpdateCheckTimestamp;

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

    this._loggerService.logComponentInitialization('SettingsPageComponent');
  }

  public checkForUpdate(): void {
    this._serviceWorkerService.checkForUpdate();
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
