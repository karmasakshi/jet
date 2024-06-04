import { DEFAULT_LOADER_CONFIGURATION } from '@jet/constants/default-loader-configuration.constant';
import { LoaderConfiguration } from '@jet/interfaces/loader-configuration.interface';
import { Observable, of } from 'rxjs';

export class LoaderServiceMock {
  public readonly loaderConfiguration$: Observable<LoaderConfiguration> = of(
    DEFAULT_LOADER_CONFIGURATION,
  );

  public hideLoader(): void {
    // Mock implementation, do nothing
  }

  public showLoader(): void {
    // Mock implementation, do nothing
  }
}
