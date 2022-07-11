import { IConfigService } from '../../config/config.service.interface';
import { IUsersRepository } from '../users.repository.interface';
import { Container } from 'inversify';
import { Types } from '../../types';
import { UsersService } from '../users.service';
import { IUsersService } from '../users.service.interface';
import 'reflect-metadata';
import { UserModel } from '@prisma/client';

const MockConfigService: IConfigService = {
	get: jest.fn(),
};
const MockRepository: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

let configService: IConfigService;
let repository: IUsersRepository;
let userService: UsersService;
let user: UserModel;
const password = '555555';
beforeAll(() => {
	const container = new Container();
	container.bind<IConfigService>(Types.ConfigService).toConstantValue(MockConfigService);
	container.bind<IUsersRepository>(Types.UsersRepository).toConstantValue(MockRepository);
	container.bind<IUsersService>(Types.UsersService).to(UsersService);

	configService = container.get(Types.ConfigService);
	repository = container.get(Types.UsersRepository);
	userService = container.get(Types.UsersService);
});

describe('user service', () => {
	test('create user', async () => {
		configService.get = jest.fn().mockReturnValueOnce(1);
		repository.create = jest.fn().mockImplementationOnce((x) => ({
			email: x.email,
			password: x.password,
			id: 1,
			name: x.name,
		}));

		const createdUser = await userService.createUser({
			name: '3',
			email: '222@gmail.com',
			password,
		});

		if (createdUser) user = createdUser;

		expect(createdUser).not.toBeNull();
		expect(createdUser?.email).toEqual('222@gmail.com');
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('333');
	});

	test('validate user with bad email', async () => {
		repository.find = jest.fn().mockReturnValueOnce(false);
		const result = await userService.validateUser({
			password,
			email: '4343@gmail.com',
		});
		expect(result).toBeFalsy();
	});

	test('validate user with good password', async () => {
		repository.find = jest.fn().mockReturnValueOnce(user);
		const result = await userService.validateUser({
			password,
			email: '4343@gmail.com',
		});
		expect(result).toBeTruthy();
	});

	test('validate user with good password', async () => {
		repository.find = jest.fn().mockReturnValueOnce(user);
		const result = await userService.validateUser({
			password: 'badPassword',
			email: '4343@gmail.com',
		});
		expect(result).toBeFalsy();
	});
});
