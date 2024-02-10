import { BrowserCacheLocation, LogLevel } from "@azure/msal-browser";
import { Configuration } from "@azure/msal-browser/dist/config/Configuration";

const clientId = "c69c7fee-c223-4365-848a-0ce903ec90cb";
const authority = "https://login.microsoftonline.com/common";

// @ts-ignore
const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

/**
 * Configuration Options
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: clientId, // This is the ONLY mandatory field that you need to supply.
    authority: authority,
    redirectUri: "/", // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
    postLogoutRedirectUri: "/login", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        console.log(message);
      },
      logLevel: LogLevel.Trace,
      piiLoggingEnabled: false,
    }
  }

}
