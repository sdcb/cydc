import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  securityObject = new AppUserAuth();

  constructor() { }

  login(user: AppUser): Observable<AppUserAuth> {
    this.resetSecurityObject();

    Object.assign(this.securityObject, LOGIN_MOCKS.find(x => x.userName === user.userName));
    if (this.securityObject.userName !== "") {
      localStorage.setItem("bearerToken", this.securityObject.bearerToken);
    }

    return of(this.securityObject).pipe(delay(200));
  }

  logout(): void {
    this.resetSecurityObject();
  }

  resetSecurityObject(): void {
    this.securityObject.userName = "";
    this.securityObject.bearerToken = "";
    this.securityObject.isAuthenticated = false;
    this.securityObject.claims = [];
    localStorage.removeItem("bearerToken");
  }

  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'"  // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
  hasClaim(claimType: any, claimValue?: any) {
    let ret: boolean = false;

    // See if an array of values was passed in.
    if (typeof claimType === "string") {
      ret = this.isClaimValid(claimType, claimValue);
    }
    else {
      let claims: string[] = claimType;
      if (claims) {
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }

    return ret;
  }

  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret: boolean = false;
    let auth: AppUserAuth = null;

    // Retrieve security object
    auth = this.securityObject;
    if (auth) {
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(":") >= 0) {
        let words: string[] = claimType.split(":");
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      }
      else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : "true";
      }
      // Attempt to find the claim
      ret = auth.claims.find(c =>
        c.claimType.toLowerCase() == claimType &&
        c.claimValue == claimValue) != null;
    }

    return ret;
  }
}

export class AppUserAuth {
  userName: string = "";
  bearerToken: string = "";
  isAuthenticated: boolean = false;
  claims: AppUserClaim[] = [];
}

export type AppUserClaim = {
  claimId: string;
  userId: string;
  claimType: string;
  claimValue: string;
}

export type AppUser = {
  userName: string;
  password: string;
}

const LOGIN_MOCKS: AppUserAuth[] = [
  {
    userName: "test",
    bearerToken: "abcd",
    isAuthenticated: true,
    claims: [],
  },
  {
    userName: "test2",
    bearerToken: "xyz",
    isAuthenticated: true,
    claims: [],
  }
];
