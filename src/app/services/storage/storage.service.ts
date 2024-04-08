import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly _prefix: string;

  public constructor(private readonly _loggerService: LoggerService) {
    this._prefix = 'xxx';

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

    const serializedValue = localStorage.getItem(this._prefix + '-' + key);

    if (serializedValue) {
      try {
        value = JSON.parse(serializedValue) as T;
      } catch (error) {
        this._loggerService.logError(error);
      }
    }

    return value;
  }

  public getSessionStorageItem<T>(key: string): null | T {
    let value: null | T = null;

    const serializedValue = sessionStorage.getItem(this._prefix + '-' + key);

    if (serializedValue) {
      try {
        value = JSON.parse(serializedValue) as T;
      } catch (error) {
        this._loggerService.logError(error);
      }
    }

    return value;
  }

  public setLocalStorageItem(key: string, value: unknown): void {
    try {
      const serializedValue: string = JSON.stringify(value);

      localStorage.setItem(this._prefix + '-' + key, serializedValue);
    } catch (error) {
      this._loggerService.logError(error);
    }
  }

  public setSessionStorageItem(key: string, value: unknown): void {
    try {
      const serializedValue: string = JSON.stringify(value);

      sessionStorage.setItem(this._prefix + '-' + key, serializedValue);
    } catch (error) {
      this._loggerService.logError(error);
    }
  }

  public removeLocalStorageItem(key: string): void {
    localStorage.removeItem(this._prefix + '-' + key);
  }

  public removeSessionStorageItem(key: string): void {
    sessionStorage.removeItem(this._prefix + '-' + key);
  }
}
