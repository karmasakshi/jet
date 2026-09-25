import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@jet/app.config';
import { AppComponent } from '@jet/components/app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
