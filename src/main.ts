import { LoggerService } from './logger/logger-service';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { Container, ContainerModule } from 'inversify';
import { Types } from './types';
import { IExceptionFilter } from './errors/exceptionFilter.interface';
import { ILogger } from './logger/logger.interface';
import { IUserController } from './users/userController.interface';
import { App } from './app';
import { IUsersService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';
import { MongooseService } from './database/mongoose.service';

const appBindings = new ContainerModule((bind) => {
	bind<ILogger>(Types.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(Types.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUserController>(Types.UserController).to(UsersController).inSingletonScope();
	bind<IUsersService>(Types.UsersService).to(UsersService).inSingletonScope();
	bind<PrismaService>(Types.PrismaService).to(PrismaService).inSingletonScope();
	bind<MongooseService>(Types.MongooseService).to(MongooseService).inSingletonScope();
	bind<IUsersRepository>(Types.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<IConfigService>(Types.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(Types.App).to(App).inSingletonScope();
});

interface BootstrapReturn {
	appContainer: Container;
	app: App;
}

const bootstrap = async (): Promise<BootstrapReturn> => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(Types.App);
	await app.init();
	return { appContainer, app };
};

export const boot = bootstrap();
