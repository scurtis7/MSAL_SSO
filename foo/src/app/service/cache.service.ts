import { Injectable } from '@angular/core';
import { AuthenticationResult } from "@azure/msal-browser";

enum CacheKey {
  TOKEN_ID = 'token.id',
  TOKEN_EXPIRES_ON = 'token.expires_on',
  TOKEN_USERNAME = 'token.username',
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() {
  }

  cacheTokenInformation(authResult: AuthenticationResult): void {
    this.setCacheObject<Object>(CacheKey.TOKEN_ID, authResult.idToken);
    this.cacheTokenExpiresOn(authResult.expiresOn);
    this.setCacheString(CacheKey.TOKEN_USERNAME, authResult.account?.username ?? "");
  }

  getIdToken(): Object {
    return this.getCache(CacheKey.TOKEN_ID) ?? '';
  }

  cacheTokenExpiresOn(expiration: Date | null): void {
    let expiresOn = 0;
    if (expiration != null) {
      expiresOn = Math.floor(expiration.getTime() / 1000);
    }
    this.setCacheObject<number>(CacheKey.TOKEN_EXPIRES_ON, expiresOn);
  }

  getTokenExpiresOn(): number {
    let expiresOn = this.getCache<number>(CacheKey.TOKEN_EXPIRES_ON);
    if (expiresOn === undefined) {
      return 0;
    }
    return expiresOn;
  }

  clearAllCache(): void {
    localStorage.clear();
  }

  private setCacheObject = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private setCacheString = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  }

  private getCache = <T>(key: string): T | undefined => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value) as T;
      } else {
        return undefined;
      }
    } catch (e) {
      console.log("Error while getting value from cache with key: " + key + "  " + e);
      return undefined;
    }
  };

}

