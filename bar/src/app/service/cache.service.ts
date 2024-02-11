import { Injectable } from '@angular/core';
import { TokenKeys } from "../model/token-keys";
import { IdToken } from "../model/id-token";
import { AcctInfo } from "../model/acct-info";

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() {
  }

  getIdToken() {
    return this.getCache<IdToken>(this.getTokenKeys().idToken);
  }

  getAccountInfo() {
    return this.getCache<AcctInfo>(this.getAccountKey());
  }

  private getTokenKeys(): TokenKeys {
    return this.getCache<TokenKeys>("msal.token.keys.c69c7fee-c223-4365-848a-0ce903ec90cb");
  }

  private getAccountKey() {
    return this.getCache<string>("msal.account.keys");
  }

  clearAllCache(): void {
    localStorage.clear();
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

