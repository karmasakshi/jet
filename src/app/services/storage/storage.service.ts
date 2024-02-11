import { Injectable } from '@angular/core';
import { APP_NAME } from '@xxx/constants/app-name.constant';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly _prefix: string;

  public constructor(private readonly _loggerService: LoggerService) {
    this._prefix = APP_NAME.toLowerCase().replace(/\s/g, '-');

    this._loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }

  public clearSessionStorage(): void {
    sessionStorage.clear();
  }

  public getLocalStorageItem<T>(key: string): null | T {
    let value = null;
    const serializedValue = localStorage.getItem(this._prefix + '-' + key);
    if (serializedValue) {
      try {
        value = JSON.parse(serializedValue);
      } catch (error) {
        this._loggerService.logUnknownError(error);
      }
    }
    return value;
  }

  public getSessionStorageItem<T>(key: string): null | T {
    let value = null;
    const serializedValue = sessionStorage.getItem(this._prefix + '-' + key);
    if (serializedValue) {
      try {
        value = JSON.parse(serializedValue);
      } catch (error) {
        this._loggerService.logUnknownError(error);
      }
    }
    return value;
  }

  public setLocalStorageItem(key: string, value: unknown): void {
    try {
      const serializedValue: string = JSON.stringify(value);
      localStorage.setItem(this._prefix + '-' + key, serializedValue);
    } catch (error) {
      this._loggerService.logUnknownError(error);
    }
  }

  public setSessionStorageItem(key: string, value: unknown): void {
    try {
      const serializedValue: string = JSON.stringify(value);
      sessionStorage.setItem(this._prefix + '-' + key, serializedValue);
    } catch (error) {
      this._loggerService.logUnknownError(error);
    }
  }

  public removeLocalStorageItem(key: string): void {
    localStorage.removeItem(this._prefix + '-' + key);
  }

  public removeSessionStorageItem(key: string): void {
    sessionStorage.removeItem(this._prefix + '-' + key);
  }
}
