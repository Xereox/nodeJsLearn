import { NextFunction, Request, Response, Router } from 'express';
import { IMiddlewareInterface } from './IMiddlewareInterface';

export interface IBaseControllerRoute {
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
	route: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	middlewares?: IMiddlewareInterface[];
}

export type IBaseFn = IBaseControllerRoute['func'];
