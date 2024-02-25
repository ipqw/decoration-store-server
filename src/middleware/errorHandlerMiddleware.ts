import { NextFunction, Request, Response } from 'express';
import ApiError from '../error/apiError';

const errorHandler = (
    err: ApiError | Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Something went wrong!' });
};

export default errorHandler;
