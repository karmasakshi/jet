import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { PageComponent } from '@jet/components/page/page.component';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';

export type MessagePageCase =
  'email-verification-pending' | 'reset-password-email-sent' | 'sign-in-link-sent';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    NgOptimizedImage,
    PageComponent,
    RouterLink,
    TranslocoModule,
  ],
  selector: 'jet-message-page',
  styles: ``,
  templateUrl: './message-page.component.html',
})
export class MessagePageComponent {
  readonly #loggerService = inject(LoggerService);

  public readonly case = input<MessagePageCase>();

  public constructor() {
    this.#loggerService.logComponentInitialization('MessagePageComponent');
  }
}
