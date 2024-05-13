import { Injectable } from '@angular/core';
import { PREFIX } from '@jet/constants/prefix.constant';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public constructor(private readonly _loggerService: LoggerService) {
    this._loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }

  public clearSessionStorage(): void {
    sessionStorage.clear();
  }

  public getLocalStorageItem<T>(key: string): null | T {
    let value: null | T = null;

    const serializedValue = localStorage.getItem(PREFIX + '-' + key);

    if (serializedValue) {
      try {
        value = JSON.parse(serializedValue) as T;
      } catch (error: unknown) {
        this._loggerService.logError(error);
      }
    }

    return value;
  }

  public getSessionStorageItem<T>(key: string): null | T {
    let value: null | T = null;

    const serializedValue = sessionStorage.getItem(PREFIX + '-' + key);

    if (serializedValue) {
      try {
        value = JSON.parse(serializedValue) as T;
      } catch (error: unknown) {
        this._loggerService.logError(error);
      }
    }

    return value;
  }

  public setLocalStorageItem(key: string, value: unknown): void {
    try {
      const serializedValue: string = JSON.stringify(value);

      localStorage.setItem(PREFIX + '-' + key, serializedValue);
    } catch (error: unknown) {
      this._loggerService.logError(error);
    }
  }

  public setSessionStorageItem(key: string, value: unknown): void {
    try {
      const serializedValue: string = JSON.stringify(value);

      sessionStorage.setItem(PREFIX + '-' + key, serializedValue);
    } catch (error: unknown) {
      this._loggerService.logError(error);
    }
  }

  public removeLocalStorageItem(key: string): void {
    localStorage.removeItem(PREFIX + '-' + key);
  }

  public removeSessionStorageItem(key: string): void {
    sessionStorage.removeItem(PREFIX + '-' + key);
  }
}
