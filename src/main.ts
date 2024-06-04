import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from '@jet/components/root/root.component';
import { appConfig } from './app/app.config';

bootstrapApplication(RootComponent, appConfig).catch((error: Error) => {
  console.error(error);
});
