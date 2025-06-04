export interface IApiSuccessResponse<T = any> {
    data: T;
    details?: string;
    pageSize?: number;
    page?: number;
    total?: number;
}
