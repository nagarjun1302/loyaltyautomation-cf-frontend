"use client";

import { jwtDecode } from "jwt-decode";

const AUTH_TOKEN_KEY = "loyalty_admin_token";

export function setFrontendAuth(token) {
  if (typeof window === "undefined" || !token) return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearFrontendAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getFrontendAuth() {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      clearFrontendAuth();
      return null;
    }

    return { token, role: decoded.role || "" };
  } catch {
    clearFrontendAuth();
    return null;
  }
}

export function isFrontendAdminAuthenticated() {
  return getFrontendAuth()?.role === "admin";
}
