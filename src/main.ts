import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from '@jet/components/root/root.component';
import { applicationConfig } from './app/app.config';

bootstrapApplication(RootComponent, applicationConfig).catch(
  (error: unknown) => {
    console.error(error);
  },
);
