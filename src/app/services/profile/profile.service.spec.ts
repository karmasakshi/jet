import { TestBed } from '@angular/core/testing';
import { AlertService } from '../alert/alert.service';
import { AlertServiceMock } from '../alert/alert.service.mock';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthenticationServiceMock } from '../authentication/authentication.service.mock';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseServiceMock } from '../supabase/supabase.service.mock';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SupabaseService, useClass: SupabaseServiceMock },
      ],
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
