export interface AuthApiResponse<T> {
    status: number
    data: T
}

export interface ErrorResponse {
    status: string
    code: number
    message: string
    info?: any
}