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
  styleUrl: './settings-page.component.scss',
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #serviceWorkerService = inject(ServiceWorkerService);
  readonly #settingsService = inject(SettingsService);
  readonly #storageService = inject(StorageService);
  readonly #translocoService = inject(TranslocoService);

  protected readonly colorSchemeOptions: ColorSchemeOption[];
  protected readonly languageOptions: LanguageOption[];
  protected readonly lastUpdateCheckTimestamp: Signal<string>;
  protected readonly settings: Signal<Settings>;
  protected readonly version: string;

  public constructor() {
    this.colorSchemeOptions = COLOR_SCHEME_OPTIONS;

    this.languageOptions = LANGUAGE_OPTIONS;

    this.lastUpdateCheckTimestamp =
      this.#serviceWorkerService.lastUpdateCheckTimestamp;

    this.settings = this.#settingsService.settings;

    this.version = packageJson.version;

    this.#loggerService.logComponentInitialization('SettingsPageComponent');
  }

  protected async checkForUpdate(): Promise<void> {
    this.#progressBarService.showQueryProgressBar();

    this.#alertService.showAlert(
      this.#translocoService.translate('alerts.checking-for-updates'),
    );

    try {
      const isUpdateFoundAndReady: boolean =
        await this.#serviceWorkerService.checkForUpdate();

      if (!isUpdateFoundAndReady) {
        this.#alertService.showAlert(
          this.#translocoService.translate(
            'alerts.youre-on-the-latest-version',
          ),
        );
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#progressBarService.hideProgressBar();
    }
  }

  protected reload(): void {
    window.location.reload();
  }

  protected reset(): void {
    this.#storageService.clearLocalStorage();
    this.#storageService.clearSessionStorage();
    this.reload();
  }

  protected updateSettings(partialSettings: Partial<Settings>): void {
    this.#settingsService.updateSettings(partialSettings);
  }
}
