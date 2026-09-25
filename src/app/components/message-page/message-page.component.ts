import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-message-page',
  styles: ``,
  templateUrl: './message-page.component.html',
})
export class MessagePageComponent {
  readonly #loggerService = inject(LoggerService);

  public readonly case = input<
    'email-verification-pending' | 'reset-password-email-sent' | 'sign-in-link-sent' | undefined
  >(undefined);

  public constructor() {
    this.#loggerService.logComponentInitialization('MessagePageComponent');
  }
}
