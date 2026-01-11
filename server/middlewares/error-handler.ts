import { NextFunction, Request, Response } from 'express';
import logger from "../config/logger.js";
import {ApiError} from "../common/error.js";

class ErrorHandler {
    public static handleError(err: Error, req: Request, res: Response, next: NextFunction): Response {
        logger.error(err?.message || 'Internal server error', err);
        if (err instanceof ApiError) {
            return res.status(err.statusCode).send({
                error: err.statusCode,
                message: err.message,
            });
        }
        return res.status(500).send({
            error: 500,
            message: err?.message ?? 'Internal server error',
        });
    }

    public static handleUncaughtError(err: Error): void {
        logger.error('Uncaught error: ', err);
    }
}

export default ErrorHandler;
