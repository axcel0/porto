export interface User {
	id: number;
	name: string;
	email: string;
	role?: "user" | "admin" | "superadmin";
}

export interface ApiResponse<T> {
	status: "success" | "error";
	message?: string;
	data?: T;
}

export interface LoginData {
	user: User;
	access_token: string;
	refresh_token: string;
}
