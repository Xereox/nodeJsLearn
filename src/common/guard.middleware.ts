import { IMiddlewareInterface } from './IMiddlewareInterface';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';

export class GuardMiddleware implements IMiddlewareInterface {
	execute(req: Request, res: Response, next: NextFunction): void {
		next(
			req.user
				? null
				: new HttpError(401, 'Пользователь не авторизован', 'GuardMiddleware'),
		);
	}
}
