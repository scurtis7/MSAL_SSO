import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { EventMessage } from "@azure/msal-browser";
import { MsalBroadcastService } from "@azure/msal-angular";
import { AuthService } from "../../auth/auth.service";

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
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        this.router.navigate(["/"]);
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
