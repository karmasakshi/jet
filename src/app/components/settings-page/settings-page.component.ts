import { DatePipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
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
  styleUrl: './settings-page.component.scss',
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {
  private readonly _loggerService = inject(LoggerService);
  private readonly _serviceWorkerService = inject(ServiceWorkerService);
  private readonly _settingsService = inject(SettingsService);
  private readonly _storageService = inject(StorageService);

  public readonly colorSchemeOptions: ColorSchemeOption[];
  public readonly languageOptions: LanguageOption[];
  public readonly lastUpdateCheckTimestamp: Signal<string>;
  public readonly settings: Signal<Settings>;
  public readonly version: string;

  public constructor() {
    this.colorSchemeOptions = COLOR_SCHEME_OPTIONS;

    this.languageOptions = LANGUAGE_OPTIONS;

    this.lastUpdateCheckTimestamp =
      this._serviceWorkerService.lastUpdateCheckTimestamp;

    this.settings = this._settingsService.settings;

    this.version = packageJson.version;

    this._loggerService.logComponentInitialization('SettingsPageComponent');
  }

  public checkForUpdate(): void {
    void this._serviceWorkerService.checkForUpdate();
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
