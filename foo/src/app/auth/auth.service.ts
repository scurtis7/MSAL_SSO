import { Injectable } from '@angular/core';
import { MsalService } from "@azure/msal-angular";
import { CacheService } from "../service/cache.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private msalService: MsalService, private cacheService: CacheService,
              private router: Router) {
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    const expireTime = this.cacheService.getTokenExpiresOn();
    if (expireTime < 1) {
      this.router.navigate(["/login"]);
    } else {
      this.cacheService.clearAllCache();
      this.msalService.logoutRedirect();
    }
  }

  isTokenValid(): boolean {
    const currentTime = Math.floor(Date.now() / 1000);  // current epoch time in seconds
    const expireTime = this.cacheService.getTokenExpiresOn();
    // console.log("Expire Time->" + expireTime + ", Current Time->" + currentTime);
    return expireTime > currentTime;
  }

  secondsUntilTokenExpires(): number {
    const currentTime = Math.floor(Date.now() / 1000);  // current epoch time in seconds
    const expireTime = this.cacheService.getTokenExpiresOn();
    if (expireTime > currentTime) {
      return (expireTime - currentTime);
    } else {
      return 0;
    }
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
