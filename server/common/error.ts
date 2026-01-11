export class ApiError extends Error {
    public readonly statusCode: number;
    constructor(errorMsg: string, statusCode: number = 500) {
        super(errorMsg);
        this.statusCode = statusCode;
    }
}
