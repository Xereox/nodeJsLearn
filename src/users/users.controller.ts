import { BaseController } from '../common/baseController';
import { inject, injectable } from 'inversify';
import { Types } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IUserController } from './userController.interface';
import { HttpError } from '../errors/httpError';
import { Request } from 'express';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersService } from './users.service.interface';
import { IBaseFn } from '../common/baseController.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { GuardMiddleware } from '../common/guard.middleware';

export type Req<T> = Request<{}, {}, T>;

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(Types.ILogger) private usersLogger: ILogger,
		@inject(Types.ConfigService) private config: IConfigService,
		@inject(Types.UsersService) private usersService: IUsersService,
	) {
		super(usersLogger, '/users');
		this.bindRoutes([
			{
				route: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				route: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				route: '/info',
				method: 'get',
				func: this.getInfo,
				middlewares: [],
			},
			{
				route: '/test',
				method: 'get',
				func: this.test,
				middlewares: [new GuardMiddleware()],
			},
		]);
	}

	login: IBaseFn = async ({ body, headers }: Req<UserLoginDto>, res, next) => {
		const result = await this.usersService.validateUser(body);
		if (result) {
			const jwt = await this.signJWT(body.email, this.config.get('SECRET'));
			res.status(200).send(jwt);
		} else {
			next(new HttpError(500, 'Ошибка авторизации'));
		}
	};

	register: IBaseFn = async ({ body }: Req<UserRegisterDto>, res, next) => {
		const result = await this.usersService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'Пользователь уже существует', 'Ошибка создания'));
		}
		this.ok(res, result);
	};

	signJWT = async (email: string, secret: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{ algorithm: 'HS256' },
				(err, encoded) => {
					err && reject(err);
					encoded && resolve(encoded);
					if (err || !encoded) {
						reject(err);
					} else {
						resolve(encoded);
					}
				},
			);
		});
	};

	getInfo: IBaseFn = async ({ user }, res) => {
		const existedUser = user ? await this.usersService.getUserInfo(user) : null;
		res.status(user ? 200 : 403).send(existedUser || 'Неавторизованный пользователь');
	};

	test: IBaseFn = (req, res) => {
		res.status(200).send('ok');
	};
}
