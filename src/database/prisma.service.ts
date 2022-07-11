import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { Types } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(Types.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect() {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService]: Успешно подключились к базе данных');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.log(
					`[PrismaService]: Ошибка подключения к базе данных : ${e.message}`,
				);
			}
		}
	}

	async disconnect() {
		await this.client.$disconnect();
		this.logger.log('[PrismaService]: Успешно отключились от базы данных');
	}
}
