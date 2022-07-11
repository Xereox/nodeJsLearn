import { inject, injectable } from 'inversify';
import { Mongoose } from 'mongoose';
import { Types } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';

@injectable()
export class MongooseService {
	client: Mongoose;
	db: 'posts';

	constructor(@inject(Types.ILogger) private logger: ILogger) {
		this.client = new Mongoose();
	}

	async connect() {
		try {
			await this.client.connect(`mongodb://localhost:27017/${this.db}`);
			this.logger.log('[MongooseService]: Успешно подключились к базе данных');
		} catch (e) {
			if (e instanceof Error)
				this.logger.log(
					`[MongooseService]: Ошибка подключения к базе данных : ${e.message}`,
				);
		}
	}

	async disconnect() {
		await this.client.disconnect();
		this.logger.log('[PrismaService]: Успешно отключились от базы данных');
	}
}
