/* eslint-disable @typescript-eslint/no-unused-vars */

import { Observable, of } from 'rxjs';

export class TitleServiceMock {
  public readonly title$: Observable<string> = of('');

  public setTitle(_title: string) {
    // Mock implementation, do nothing
  }
}
