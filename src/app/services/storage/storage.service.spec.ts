import { TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@jet/modules/transloco-testing.module';
import { LoggerService } from '../logger/logger.service';
import { MockLoggerService } from '../logger/logger.service.mock';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [{ provide: LoggerService, useClass: MockLoggerService }],
    });

    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear localStorage', () => {
    const key = 'key';
    const value = 'value';
    localStorage.setItem(key, value);
    service.clearLocalStorage();
    expect(localStorage.length).toBe(0);
  });

  it('should clear sessionStorage', () => {
    const key = 'key';
    const value = 'value';
    sessionStorage.setItem(key, value);
    service.clearSessionStorage();
    expect(sessionStorage.length).toBe(0);
  });

  it('should get null from localStorage when item does not exist', () => {
    const key = 'nonexistent';
    const value = service.getLocalStorageItem(key);
    expect(value).toBeNull();
  });

  it('should get null from sessionStorage when item does not exist', () => {
    const key = 'nonexistent';
    const value = service.getSessionStorageItem(key);
    expect(value).toBeNull();
  });

  it('should set and get item from localStorage', () => {
    const key = 'key';
    const value = 'value';
    service.setLocalStorageItem(key, value);
    expect(service.getLocalStorageItem<string>(key)).toBe(value);
  });

  it('should set and get item from sessionStorage', () => {
    const key = 'key';
    const value = 'value';
    service.setSessionStorageItem(key, value);
    expect(service.getSessionStorageItem<string>(key)).toBe(value);
  });

  it('should remove item from localStorage', () => {
    const key = 'key';
    const value = 'value';
    localStorage.setItem(key, value);
    service.removeLocalStorageItem(key);
    expect(service.getLocalStorageItem<string>(key)).toBeNull();
  });

  it('should remove item from sessionStorage', () => {
    const key = 'key';
    const value = 'value';
    sessionStorage.setItem(key, value);
    service.removeSessionStorageItem(key);
    expect(service.getSessionStorageItem<string>(key)).toBeNull();
  });
});
