import { RouterStateSnapshot } from '@angular/router';

export class PageMetadataServiceMock {
  public updateTitle: (snapshot: RouterStateSnapshot) => void = () => undefined;
}
