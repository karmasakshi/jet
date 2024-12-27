import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
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
export class MessagePageComponent implements OnInit, OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _loggerService = inject(LoggerService);

  private _routeDataSubscription: Subscription;

  public case:
    | 'email-verification-pending'
    | 'reset-password-email-sent'
    | undefined;

  public constructor() {
    this._routeDataSubscription = Subscription.EMPTY;

    this.case = undefined;

    this._loggerService.logComponentInitialization('MessagePageComponent');
  }

  public ngOnInit(): void {
    this._routeDataSubscription = this._activatedRoute.data.subscribe(
      (data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.case = data['case'];
      },
    );
  }

  public ngOnDestroy(): void {
    this._routeDataSubscription.unsubscribe();
  }
}
