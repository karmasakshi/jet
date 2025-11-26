import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
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
import { UserService } from '@jet/services/user/user.service';
import { TranslocoModule } from '@jsverse/transloco';
import { User } from '@supabase/supabase-js';

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
  readonly #userService = inject(UserService);

  public readonly isLargeViewport: InputSignal<boolean> = input.required();
  public readonly shouldAddSafeArea: InputSignal<boolean> = input.required();

  public readonly toggleMatSidenav: OutputEmitterRef<void> = output();

  public readonly progressBarConfiguration: Signal<ProgressBarConfiguration>;
  public readonly toolbarTitle: Signal<string | undefined>;
  public readonly user: Signal<null | User>;

  public constructor() {
    this.progressBarConfiguration =
      this.#progressBarService.progressBarConfiguration;

    this.toolbarTitle = this.#toolbarTitleService.toolbarTitle;

    this.user = this.#userService.user;

    this.#loggerService.logComponentInitialization('ToolbarComponent');
  }
}
