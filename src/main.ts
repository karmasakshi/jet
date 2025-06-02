import { bootstrapApplication } from '@angular/platform-browser';
import { App } from '@jet/components/app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
