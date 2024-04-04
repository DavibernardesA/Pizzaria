import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../helpers/api-error';
import { AxiosError } from 'axios';
import chat from '../chat/statusMessage';
import { AxiosErrorData } from '../@types/error-axios';

export const errorMiddleware: (
  err: Error & Partial<ApiError> & Partial<AxiosError<AxiosErrorData>>,
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> = async (
  err: Error & Partial<ApiError> & Partial<AxiosError<AxiosErrorData>>,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const statusCode = err.statusCode ?? 500;
  err.response
    ? res.status(400).json({ message: err.response.data.error.message || chat.errorCardCharging || err.message })
    : res.status(statusCode).json({ message: err.message });
};
