import { Injectable } from '@angular/core';
import { MsalService } from "@azure/msal-angular";
import { CacheService } from "../service/cache.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private msalService: MsalService, private cacheService: CacheService) {
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    this.cacheService.clearAllCache();
    this.msalService.logoutRedirect();
  }

  // isUserLoggedIn(): boolean {
  //   return this.isTokenValid();
  // }
  //
  // private isTokenValid(): boolean {
  //   const currentTime = Math.floor(Date.now() / 1000);  // current epoch time in seconds
  //   const expireTime = this.cacheService.getTokenExpiresOn();
  //   // console.log("Current Time->" + currentTime + "   Expire Time->" + expireTime);
  //   if (expireTime === undefined) {
  //     return false;
  //   }
  //   return expireTime > currentTime;
  // }

}
