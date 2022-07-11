import { IUsersService } from './users.service.interface';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Types } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(Types.ConfigService) private configService: IConfigService,
		@inject(Types.UsersRepository) private repository: IUsersRepository,
	) {}
	async createUser({
		name,
		email,
		password,
	}: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = +this.configService.get('SALT');
		await newUser.setPassword(password, salt);
		const isExist = await this.repository.find(email);
		return isExist ? null : this.repository.create(newUser);
	}

	async validateUser({ password, email }: UserLoginDto) {
		const user = await this.repository.find(email);
		if (!user) return false;
		return await User.comparePassword(password, user.password);
	}

	getUserInfo(email: string) {
		return this.repository.find(email);
	}
}
