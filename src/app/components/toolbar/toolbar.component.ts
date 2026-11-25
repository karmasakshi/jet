import { Component, inject, input, output, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AnalyticsEventDirective } from '@jet/directives/analytics-event/analytics-event.directive';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { shortTextFillIcon } from '@jet/svgs/short_text-fill';
import { addSvgIcons } from '@jet/utilities/add-svg-icons.utility';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  imports: [
    AnalyticsEventDirective,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterLink,
    TranslocoModule,
  ],
  selector: 'jet-toolbar',
  styles: `
    mat-progress-bar {
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      z-index: 2;
    }
  `,
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #toolbarTitleService = inject(ToolbarTitleService);

  protected readonly progressBarConfiguration: Signal<ProgressBarConfiguration>;
  protected readonly title: Signal<string>;
  protected readonly toggleMatSidenav = output<void>();

  public readonly isLargeViewport = input.required<boolean>();
  public readonly shouldAddSafeAreaPadding = input.required<boolean>();

  public constructor() {
    addSvgIcons([shortTextFillIcon, { name: 'logo', url: './media/logo.svg' }]);

    this.progressBarConfiguration = this.#progressBarService.progressBarConfiguration;

    this.title = this.#toolbarTitleService.toolbarTitle;

    this.#loggerService.logComponentInitialization('ToolbarComponent');
  }
}
