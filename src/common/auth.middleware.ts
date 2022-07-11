import { IMiddlewareInterface } from './IMiddlewareInterface';
import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

type Dec = {
	email: string;
};

export class AuthMiddleware implements IMiddlewareInterface {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const jwt = req.headers.authorization?.split(' ')?.pop();
		if (!jwt) return next();

		verify(jwt, this.secret, (err, decoded) => {
			if (err || !decoded) {
				next();
			} else {
				req.user = (decoded as Dec).email;
				next();
			}
		});
	}
}
