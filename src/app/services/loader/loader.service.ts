import { Injectable } from '@angular/core';
import { DEFAULT_LOADER_CONFIGURATION } from '@jet/constants/default-loader-configuration.constant';
import { LoaderConfiguration } from '@jet/interfaces/loader-configuration.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public readonly loaderConfiguration$: Observable<LoaderConfiguration>;

  private readonly _loaderConfigurationSubject$: BehaviorSubject<LoaderConfiguration>;

  public constructor(private readonly _loggerService: LoggerService) {
    this._loaderConfigurationSubject$ =
      new BehaviorSubject<LoaderConfiguration>(DEFAULT_LOADER_CONFIGURATION);

    this.loaderConfiguration$ =
      this._loaderConfigurationSubject$.asObservable();

    this._loggerService.logServiceInitialization('LoaderService');
  }

  public hideLoader(): void {
    this._loaderConfigurationSubject$.next({
      ...DEFAULT_LOADER_CONFIGURATION,
      isVisible: false,
    });
  }

  public showLoader(): void {
    this._loaderConfigurationSubject$.next({
      ...DEFAULT_LOADER_CONFIGURATION,
      isVisible: true,
    });
  }
}
