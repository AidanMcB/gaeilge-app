import type { User } from "@/ts/User";

export interface AuthApiResponse<T> {
    status: number
    data: T
    error?: string
    details?: string
}

export interface AuthApiResponseBody {
    user: User;
}

export type LoginApiResponse = AuthApiResponse<AuthApiResponseBody>;
export type SignUpApiResponse = AuthApiResponse<AuthApiResponseBody>;
export type GetCurrentUserApiResponse = AuthApiResponse<AuthApiResponseBody>;
