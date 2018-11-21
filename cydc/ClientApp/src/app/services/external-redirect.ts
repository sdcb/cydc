import { InjectionToken, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

export const loginProvider = new InjectionToken("loginProvider")

export function loginResolver(route: ActivatedRouteSnapshot) {
  location.href = `/user/login?fromUrl=${encodeURIComponent(location.href)}`;
}
