export interface HTTPPaginatedResponse<T> {
    data: {
        count: number;
        next: string;
        previous: string;
        results: T[];
    };
    status: number;
    statusText: string;
}