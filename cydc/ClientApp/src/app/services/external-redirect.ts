import { InjectionToken, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

export const loginProvider = new InjectionToken("loginProvider")

export function loginResolver(route: ActivatedRouteSnapshot) {
  location.href = `/api/user/login?fromUrl=${encodeURIComponent(location.pathname + location.search)}`;
}
