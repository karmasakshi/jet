import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { AlertService } from '@jet/services/alert/alert.service';
import { AlertServiceMock } from '@jet/services/alert/alert.service.mock';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ProgressBarServiceMock } from '@jet/services/progress-bar/progress-bar.service.mock';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { ServiceWorkerServiceMock } from '@jet/services/service-worker/service-worker.service.mock';
import { SettingsService } from '@jet/services/settings/settings.service';
import { SettingsServiceMock } from '@jet/services/settings/settings.service.mock';
import { StorageService } from '@jet/services/storage/storage.service';
import { StorageServiceMock } from '@jet/services/storage/storage.service.mock';
import { UserService } from '@jet/services/user/user.service';
import { UserServiceMock } from '@jet/services/user/user.service.mock';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: AlertService, useClass: AlertServiceMock },
    { provide: AnalyticsService, useClass: AnalyticsServiceMock },
    { provide: ProgressBarService, useClass: ProgressBarServiceMock },
    { provide: ServiceWorkerService, useClass: ServiceWorkerServiceMock },
    { provide: SettingsService, useClass: SettingsServiceMock },
    { provide: StorageService, useClass: StorageServiceMock },
    { provide: UserService, useClass: UserServiceMock },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
