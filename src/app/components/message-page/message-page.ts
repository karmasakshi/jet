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
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { Page } from '../page/page';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    TranslocoModule,
    Page,
  ],
  selector: 'jet-message-page',
  styleUrl: './message-page.scss',
  templateUrl: './message-page.html',
})
export class MessagePage implements OnInit {
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _loggerService = inject(LoggerService);

  public readonly case: InputSignal<
    | undefined
    | 'email-verification-pending'
    | 'not-found'
    | 'reset-password-email-sent'
    | 'sign-in-link-sent'
  > = input();

  public constructor() {
    this._loggerService.logComponentInitialization('MessagePage');
  }

  public ngOnInit(): void {
    this._analyticsService.logEvent('Show message', { case: this.case() });
  }
}
