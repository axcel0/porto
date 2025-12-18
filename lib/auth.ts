"use client";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function getAccessToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh?: string) {
	if (typeof window === "undefined") return;
	localStorage.setItem(ACCESS_KEY, access);
	if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(ACCESS_KEY);
	localStorage.removeItem(REFRESH_KEY);
}
