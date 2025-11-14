/* eslint-disable no-console */

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@jet/components/app/app.component';
import { applicationConfig } from './app/app.config';

bootstrapApplication(AppComponent, applicationConfig).catch((err) =>
  console.error(err),
);
