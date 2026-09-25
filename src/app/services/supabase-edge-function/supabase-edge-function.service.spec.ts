import { TestBed } from '@angular/core/testing';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { SupabaseEdgeFunctionService } from './supabase-edge-function.service';

describe('SupabaseEdgeFunctionService', () => {
  let service: SupabaseEdgeFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SUPABASE_CLIENT, useValue: undefined },
        { provide: LoggerService, useClass: LoggerServiceMock },
        SupabaseEdgeFunctionService,
      ],
    });
    service = TestBed.inject(SupabaseEdgeFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
