import { TestBed } from '@angular/core/testing';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SUPABASE_CLIENT, useValue: undefined },
        { provide: LoggerService, useClass: LoggerServiceMock },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
