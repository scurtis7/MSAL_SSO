import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, finalize, interval, map, Observable, Subscription, takeWhile, timer } from "rxjs";

// const expireInterval$ = interval(1000);

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrl: './warning.component.scss'
})
export class WarningComponent implements OnInit, OnDestroy {

  expire: number;
  secondsRemaining$: Observable<number>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<WarningComponent>) {
    this.expire = data.expire;
  }

  ngOnInit(): void {
    this.secondsRemaining$ = timer(0, 1000).pipe(
      map(n => this.expire - n),
      takeWhile(n => n >= 0),
    );
  }

  logout(logout: boolean): void {
    console.log("Logout: ", logout);
    this.dialogRef.close(logout);
  }

  ngOnDestroy(): void {
  }

}
