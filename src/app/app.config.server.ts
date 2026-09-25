import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { AlertService } from './services/alert/alert.service';
import { AlertServiceMock } from './services/alert/alert.service.mock';
import { ProgressBarService } from './services/progress-bar/progress-bar.service';
import { ProgressBarServiceMock } from './services/progress-bar/progress-bar.service.mock';
import { ServiceWorkerService } from './services/service-worker/service-worker.service';
import { ServiceWorkerServiceMock } from './services/service-worker/service-worker.service.mock';
import { SettingsService } from './services/settings/settings.service';
import { SettingsServiceMock } from './services/settings/settings.service.mock';
import { StorageService } from './services/storage/storage.service';
import { StorageServiceMock } from './services/storage/storage.service.mock';
import { UserService } from './services/user/user.service';
import { UserServiceMock } from './services/user/user.service.mock';

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
