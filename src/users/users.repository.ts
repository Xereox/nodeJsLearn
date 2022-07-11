import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { Types } from '../types';
import { PrismaService } from '../database/prisma.service';
import 'reflect-metadata';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(Types.PrismaService) private service: PrismaService) {}

	async create({ name, email, password }: User): Promise<UserModel> {
		return await this.service.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return await this.service.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
