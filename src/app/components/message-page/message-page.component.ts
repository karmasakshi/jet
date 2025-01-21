import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-message-page',
  styleUrl: './message-page.component.scss',
  templateUrl: './message-page.component.html',
})
export class MessagePageComponent implements OnInit {
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _loggerService = inject(LoggerService);

  public readonly case: InputSignal<
    | 'email-verification-pending'
    | 'not-found'
    | 'reset-password-email-sent'
    | 'sign-in-link-sent'
    | undefined
  > = input();

  public constructor() {
    this._loggerService.logComponentInitialization('MessagePageComponent');
  }

  public ngOnInit(): void {
    this._analyticsService.logEvent('Message shown', { case: this.case() });
  }
}
