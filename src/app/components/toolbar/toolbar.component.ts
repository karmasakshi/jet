import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterLink,
    AnalyticsDirective,
    TranslocoModule,
  ],
  selector: 'jet-toolbar',
  styleUrl: './toolbar.component.scss',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #toolbarTitleService = inject(ToolbarTitleService);

  public readonly isLargeViewport = input.required<boolean>();
  public readonly shouldAddSafeArea = input.required<boolean>();

  protected readonly toggleMatSidenav = output<void>();

  protected readonly progressBarConfiguration: Signal<ProgressBarConfiguration>;
  protected readonly toolbarTitle: Signal<null | string>;

  public constructor() {
    this.progressBarConfiguration =
      this.#progressBarService.progressBarConfiguration;

    this.toolbarTitle = this.#toolbarTitleService.toolbarTitle;

    this.#loggerService.logComponentInitialization('ToolbarComponent');
  }
}
