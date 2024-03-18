import { Injectable } from '@angular/core';
import { TokenKeys } from "../model/token-keys";
import { IdToken } from "../model/id-token";
import { AcctInfo } from "../model/acct-info";
import { AuthenticationResult } from "@azure/msal-browser";
import { JwtToken } from "../model/jwt-token";

enum CacheKey {
  ID_TOKEN = 'foo.token.id_token',
  TOKEN_EXPIRES_ON = 'foo.token.expires_on',
  TOKEN_USERNAME = 'foo.token.username',
  ACCOUNT_INFO = "foo.account"
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() {
  }

  cacheTokenInformation(authResult: AuthenticationResult): void {
    const token = this.getDecodedToken(authResult.idToken);
    this.setCacheObject<Object>(CacheKey.ID_TOKEN, authResult.idToken);
    this.setCacheObject<number>(CacheKey.TOKEN_EXPIRES_ON, token.exp ?? 0);
    this.setCacheString(CacheKey.TOKEN_USERNAME, authResult.account?.username ?? "");
    this.setCacheObject(CacheKey.ACCOUNT_INFO, authResult.account);
  }

  getAccount() {
    return this.getCache<AcctInfo>(CacheKey.ACCOUNT_INFO);
  }

  private setCacheObject = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private setCacheString = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  }

  private getDecodedToken(token: string): JwtToken {
    const base64Payload = token.split(".")[1];
    const payload = decodeURIComponent(
      atob(base64Payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(payload);
  }

  getTokenExpiresOn(): number {
    return this.getCache<number>(CacheKey.TOKEN_EXPIRES_ON) ?? 0;
  }

  getIdToken() {
    return this.getCache<IdToken>(this.getTokenKeys().idToken);
  }

  getAccountInfo() {
    return this.getCache<AcctInfo>(this.getAccountKey());
  }

  private getTokenKeys(): TokenKeys {
    return this.getCache<TokenKeys>("msal.token.keys.8f4f63c9-a875-441b-b01a-ffb8a2f2da51");
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

