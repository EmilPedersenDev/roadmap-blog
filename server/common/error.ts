import { ValidationError } from 'express-validator';

export class ApiError extends Error {
    public readonly statusCode: number;
    constructor(errorMsg: string, statusCode: number = 500) {
        super(errorMsg);
        this.statusCode = statusCode;
    }
}

export class ApiValidationError extends ApiError {
    public readonly errors: Array<ValidationError>;
    constructor(errorMsg: string, statusCode: number, errors?: Array<ValidationError>) {
        super(errorMsg, statusCode);
        this.errors = errors || [];
    }
}
