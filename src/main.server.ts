import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { config } from '@jet/app.config.server';
import { AppComponent } from '@jet/components/app/app.component';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, config, context);

export default bootstrap;
