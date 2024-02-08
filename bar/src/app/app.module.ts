import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from "./common/material.module";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MenuComponent } from './components/shared/menu/menu.component';
import { DetailComponent } from './components/detail/detail.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserUtils, InteractionType, IPublicClientApplication, PublicClientApplication } from "@azure/msal-browser";
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalModule, MsalRedirectComponent, MsalService } from "@azure/msal-angular";
import { msalConfig } from "./auth/auth-config";

/**
 * Documentation for MSAL
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/configuration.md
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect
  };
}

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail', component: DetailComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MenuComponent,
    DetailComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(routes,
      {
        // Don't perform initial navigation in iframes or popups
        initialNavigation:
          !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
            ? "enabledNonBlocking" : "disabled", // Set to enabledBlocking to use Angular Universal
      }),
    MsalModule
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
}
