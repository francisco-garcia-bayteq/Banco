export interface ApiResponse<T> {
    data: T;
    message?: string;
    name?: string;
}