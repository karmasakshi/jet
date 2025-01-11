import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input, InputSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-message-page',
  styleUrl: './message-page.component.scss',
  templateUrl: './message-page.component.html',
})
export class MessagePageComponent {
  private readonly _loggerService = inject(LoggerService);

  public readonly case: InputSignal<
    | 'email-verification-pending'
    | 'reset-password-email-sent'
    | 'sign-in-link-sent'
    | undefined
  > = input();

  public constructor() {
    this._loggerService.logComponentInitialization('MessagePageComponent');
  }
}
