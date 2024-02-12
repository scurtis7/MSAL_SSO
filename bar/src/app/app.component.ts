import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
import { MsalBroadcastService } from "@azure/msal-angular";
import { AuthenticationResult, EventMessage, EventType } from "@azure/msal-browser";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'bar';

  private readonly _destroying$ = new Subject<void>();

  constructor(private msalBroadcastService: MsalBroadcastService, private router: Router) {
  }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        takeUntil(this._destroying$)
      )
      .subscribe((event: EventMessage) => {
        switch (event.eventType) {
          case EventType.ACQUIRE_TOKEN_START:
          case EventType.LOGIN_START: {
            console.log("*** MSAL Event: ACQUIRE_TOKEN_START or LOGIN_START  => " + event.eventType);
            break;
          }
          case EventType.LOGIN_SUCCESS:
          case EventType.ACQUIRE_TOKEN_SUCCESS: {
            console.log("*** MSAL Event: LOGIN_SUCCESS or ACQUIRE_TOKEN_SUCCESS  => " + event.eventType);
            const authResult = event.payload as AuthenticationResult;
            console.log(authResult.idToken);
            break;
          }
          case EventType.ACQUIRE_TOKEN_FAILURE:
          case EventType.LOGIN_FAILURE: {
            console.log("*** MSAL Event: ACQUIRE_TOKEN_FAILURE or LOGIN_FAILURE => " + event.eventType);
            break;
          }
          case EventType.LOGOUT_SUCCESS: {
            console.log("*** MSAL Event: LOGOUT_SUCCESS => " + event.eventType);
            this.router.navigate(["/login"]);
            break;
          }
          default: {
            // do nothing
            console.log("*** MSAL Event: Ignoring event type => " + event.eventType);
            break;
          }
        }


      });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
