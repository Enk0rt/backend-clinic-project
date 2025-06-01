export interface IApiSuccessResponse<T = any> {
    data: T;
    details?: string;
}
