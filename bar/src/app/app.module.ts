import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "./common/material.module";

const routes: Routes = [
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'detail', component: DetailComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
