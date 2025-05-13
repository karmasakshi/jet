import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseServiceMock } from '../supabase/supabase.service.mock';
import { UserService } from '../user/user.service';
import { UserServiceMock } from '../user/user.service.mock';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SupabaseService, useClass: SupabaseServiceMock },
        { provide: UserService, useClass: UserServiceMock },
      ],
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
