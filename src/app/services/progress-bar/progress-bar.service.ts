import { Injectable } from '@angular/core';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  public readonly progressBarConfiguration$: Observable<ProgressBarConfiguration>;

  private readonly _defaultProgressBarConfiguration: ProgressBarConfiguration;
  private readonly _progressBarConfigurationSubject$: BehaviorSubject<ProgressBarConfiguration>;

  public constructor(private readonly _loggerService: LoggerService) {
    this._defaultProgressBarConfiguration = {
      bufferValue: 0,
      isVisible: false,
      mode: 'indeterminate',
      value: 0,
    };

    this._progressBarConfigurationSubject$ =
      new BehaviorSubject<ProgressBarConfiguration>(
        this._defaultProgressBarConfiguration,
      );

    this.progressBarConfiguration$ =
      this._progressBarConfigurationSubject$.asObservable();

    this._loggerService.logServiceInitialization('ProgressBarService');
  }

  public hideProgressBar(): void {
    this._progressBarConfigurationSubject$.next({
      ...this._defaultProgressBarConfiguration,
      isVisible: false,
    });
  }

  public showProgressBar(
    partialProgressBarConfiguration: Partial<ProgressBarConfiguration>,
  ): void {
    this._progressBarConfigurationSubject$.next({
      ...this._defaultProgressBarConfiguration,
      ...partialProgressBarConfiguration,
      isVisible: true,
    });
  }
}
