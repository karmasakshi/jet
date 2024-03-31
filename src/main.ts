import { bootstrapApplication } from '@angular/platform-browser';
import { MainComponent } from '@xxx/components/main/main.component';
import { applicationConfig } from './app/app.config';

bootstrapApplication(MainComponent, applicationConfig).catch(
  (error: unknown) => {
    console.error(error);
  },
);
