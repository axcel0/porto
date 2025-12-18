"use client";

import ky from "ky";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./auth";
import type { ApiResponse, LoginData } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type StrNumBool = string | number | boolean;
type SearchParamsLike = Record<string, StrNumBool> | Array<[string, StrNumBool]> | URLSearchParams;

const http = ky.create({
	prefixUrl: BASE_URL,
	hooks: {
		beforeRequest: [
			async (request) => {
				const token = getAccessToken();
				if (token) request.headers.set("Authorization", `Bearer ${token}`);
				if (!request.headers.get("Content-Type")) {
					request.headers.set("Content-Type", "application/json");
				}
			},
		],
		afterResponse: [
			async (request, _options, response) => {
				if (response.status === 401) {
					const refresh = getRefreshToken();
					if (!refresh) {
						clearTokens();
						return response;
					}
					try {
						const refreshRes = await ky
							.post(`${BASE_URL}/api/v1/auth/refresh`, {
								json: { refresh_token: refresh },
							})
							.json<ApiResponse<LoginData>>();
						const tokens = refreshRes?.data;
						if (tokens?.access_token) {
							setTokens(tokens.access_token, tokens.refresh_token ?? refresh);
							// retry original request with new token
							const newReq = new Request(request, request);
							newReq.headers.set("Authorization", `Bearer ${tokens.access_token}`);
							return ky(newReq);
						}
					} catch {
						clearTokens();
					}
				}
				return response;
			},
		],
	},
});

export const api = {
	get: <T>(path: string, searchParams?: SearchParamsLike) =>
		http.get(path.replace(/^\//, ""), { searchParams }).json<T>(),
	post: <T>(path: string, body?: unknown) =>
		http.post(path.replace(/^\//, ""), { json: body }).json<T>(),
	put: <T>(path: string, body?: unknown) =>
		http.put(path.replace(/^\//, ""), { json: body }).json<T>(),
	patch: <T>(path: string, body?: unknown) =>
		http.patch(path.replace(/^\//, ""), { json: body }).json<T>(),
	delete: <T>(path: string) => http.delete(path.replace(/^\//, "")).json<T>(),
};

export { BASE_URL, http };
