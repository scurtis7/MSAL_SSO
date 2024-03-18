import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, takeUntil } from "rxjs";
import { MsalBroadcastService } from "@azure/msal-angular";
import { AuthenticationResult, EventMessage, EventType } from "@azure/msal-browser";
import { Router } from "@angular/router";
import { CacheService } from "./service/cache.service";
import { AuthService } from "./auth/auth.service";
import { WarningComponent } from "./components/warning/warning.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

const warningInterval$ = interval(30000);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'foo';

  warningDialogIsDisplayed: boolean = false;

  private readonly _destroying$ = new Subject<void>();

  subscription = warningInterval$.subscribe((value) => {
    if (this.authService.isTokenValid()) {
      const expireTime = this.authService.secondsUntilTokenExpires();
      this.displayWarning(expireTime);
    } else {
      this.authService.logout();
    }
  });

  constructor(private msalBroadcastService: MsalBroadcastService, private cacheService: CacheService,
              private router: Router, private authService: AuthService, private dialog: MatDialog) {
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
            this.cacheService.cacheTokenInformation(authResult);
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

  private displayWarning(expireTime: number) {
    console.log(`Token will expire in: ${expireTime} seconds`);
    if (this.warningDialogIsDisplayed) {
      console.log("Dialog is already displayed");
      return;
    }
    this.warningDialogIsDisplayed = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    // dialogConfig.id = id;
    dialogConfig.height = "175";
    dialogConfig.width = "100";
    dialogConfig.data = {
      expire: expireTime
    };
    const dialogRef = this.dialog.open(WarningComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
        this.warningDialogIsDisplayed = false;
        console.log(`Result returned from logout warning dialog is: ${result}`);
        if (result) {
          this.authService.logout();
        } else {
          this.authService.login();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.subscription.unsubscribe();
  }

}
