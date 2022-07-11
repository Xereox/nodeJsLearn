import { boot } from '../../main';
import { App } from '../../app';
import supertest from 'supertest';

let application: App;
beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('ss', () => {
	test('cant create existed user', async () => {
		const res = await supertest(application.app)
			.post('/users/register')
			.send({ email: 'w0w3d3thegame@gmail.com', name: '535353', password: '4344343' });
		expect(res.statusCode).toBe(422);
		expect(res.body.err).toBe('Пользователь уже существует');
	});
	test('cant create existed user', async () => {
		const res = await supertest(application.app)
			.post('/users/register')
			.send({ email: 'w0w3d3thegame@gmail.com', password: '4344343' });
		expect(res.statusCode).toBe(422);
		console.log(res);
		expect(res.body[0].isString).toBe('Не указано имя');
	});
});

afterAll(() => {
	application.close();
});
