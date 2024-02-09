import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { filter, Subject, takeUntil } from "rxjs";
import { AuthenticationResult, EventMessage, EventType } from "@azure/msal-browser";
import { MsalBroadcastService } from "@azure/msal-angular";
import { AuthService } from "../../auth/auth.service";
import { CacheService } from "../../service/cache.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
    private authService: AuthService,
    private cacheService: CacheService) {
  }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => {
          return msg.eventType.includes(EventType.LOGIN_SUCCESS || EventType.LOGIN_FAILURE
            || EventType.ACQUIRE_TOKEN_SUCCESS || EventType.ACQUIRE_TOKEN_FAILURE || EventType.LOGOUT_SUCCESS
            || EventType.LOGOUT_FAILURE || EventType.LOGOUT_END);
        }),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        if (result.eventType.includes(EventType.LOGIN_SUCCESS || EventType.ACQUIRE_TOKEN_SUCCESS) && result?.payload) {
          const authResult = result.payload as AuthenticationResult;
          this.cacheService.cacheTokenInformation(authResult);
          console.log("ID Token => " + authResult.idToken);
        } else if (result.eventType.includes(EventType.LOGOUT_SUCCESS || EventType.LOGOUT_END)) {
          this.cacheService.clearAllCache();
          this.router.navigate(["/"]);
        } else {
          console.log("Ignoring event type => " + result.eventType);
        }
      });
  }

  login(): void {
    this.authService.login();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
