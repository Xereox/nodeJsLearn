import { NextFunction, Request, Response } from 'express';
import { HttpError } from './httpError';
import { ILogger } from '../logger/logger.interface';
import { IExceptionFilter } from './exceptionFilter.interface';
import { inject, injectable } from 'inversify';
import { Types } from '../types';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(Types.ILogger) private logger: ILogger) {}

	catch = (err: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] Ошибка: ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(err.message);
			res.status(500).send({
				error: err.message,
			});
		}
	};
}
