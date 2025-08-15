import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-message-page',
  styleUrl: './message-page.component.scss',
  templateUrl: './message-page.component.html',
})
export class MessagePageComponent implements OnInit {
  readonly #analyticsService = inject(AnalyticsService);
  readonly #loggerService = inject(LoggerService);

  public readonly case: InputSignal<
    | 'email-verification-pending'
    | 'not-found'
    | 'reset-password-email-sent'
    | 'sign-in-link-sent'
    | undefined
  > = input();

  public constructor() {
    this.#loggerService.logComponentInitialization('MessagePageComponent');
  }

  public ngOnInit(): void {
    this.#analyticsService.logEvent('Show message', { case: this.case() });
  }
}
