import { TestBed } from '@angular/core/testing';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { UserService } from '../user/user.service';
import { UserServiceMock } from '../user/user.service.mock';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SUPABASE_CLIENT, useValue: {} },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: UserService, useClass: UserServiceMock },
      ],
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
