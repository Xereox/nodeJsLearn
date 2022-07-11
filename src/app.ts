import express, { Express, json } from 'express';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { IExceptionFilter } from './errors/exceptionFilter.interface';
import { inject, injectable } from 'inversify';
import { Types } from './types';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { UsersController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';
import { MongooseService } from './database/mongoose.service';

@injectable()
export class App {
	port: number;
	app: Express;
	server: Server;

	constructor(
		@inject(Types.ILogger) private logger: ILogger,
		@inject(Types.UserController) private userController: UsersController,
		@inject(Types.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(Types.ConfigService) private configService: IConfigService,
		@inject(Types.PrismaService) private prismaService: PrismaService,
		@inject(Types.MongooseService) private mongooseService: MongooseService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware() {
		this.app.use(json());
		const auth = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(auth.execute.bind(auth));
	}

	useRoutes(): void {
		this.app.use(...this.userController.getAppUseAgrs());
	}

	useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch);
	}

	async useDataBase(): Promise<void> {
		await this.prismaService.connect();
		await this.mongooseService.connect();
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();
		await this.useDataBase();
		this.server = this.app.listen(this.port);
		this.logger.warn(`Server successfully started on https://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}

console.log(App.prototype);
