import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseServiceMock } from '../supabase/supabase.service.mock';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SupabaseService, useClass: SupabaseServiceMock },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
