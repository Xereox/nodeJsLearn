import { Response, Router } from 'express';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IBaseControllerRoute } from './baseController.interface';

@injectable()
export abstract class BaseController {
	private readonly $router: Router;

	constructor(private logger: ILogger, private readonly $path: string) {
		this.$router = Router();
	}

	public get router(): Router {
		return this.$router;
	}

	protected send<T>(res: Response, code: number, message: T) {
		return res.type('application/json').status(code).json(message);
	}

	protected ok<T>(res: Response, message: T) {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response) {
		return res.status(201);
	}

	protected bindRoutes(routes: IBaseControllerRoute[]) {
		routes.forEach(({ route, method, func, middlewares = [] }) => {
			this.logger.log(
				`[${this.constructor.name}]: [${this.$path}${route}] on <|${method}|> connected`,
			);
			this.$router[method](
				route,
				...middlewares.map((m) => m.execute.bind(this)),
				func.bind(this),
			);
		});
	}

	public getAppUseAgrs(): [string, Router] {
		return [this.$path, this.$router];
	}
}
