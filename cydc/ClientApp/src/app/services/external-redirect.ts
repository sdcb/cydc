import { InjectionToken, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { HttpClient } from "@angular/common/http";

export const loginProvider = new InjectionToken("externalUrlRedirectResolver")

export function loginResolver(route: ActivatedRouteSnapshot) {
  location.href = `/user/login?fromUrl=${encodeURIComponent(location.href)}`;
}
