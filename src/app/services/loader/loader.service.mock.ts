import { LoaderConfiguration } from '@jet/interfaces/loader-configuration.interface';
import { Observable, of } from 'rxjs';

export class LoaderServiceMock {
  public readonly loaderConfiguration$: Observable<LoaderConfiguration> = of({
    bufferValue: 0,
    isVisible: false,
    mode: 'indeterminate',
    value: 0,
  });

  public hideLoader(): void {
    // Mock implementation, do nothing
  }

  public showLoader(): void {
    // Mock implementation, do nothing
  }
}
