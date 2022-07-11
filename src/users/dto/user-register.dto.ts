import { IsEmail, IsString } from 'class-validator';
import 'reflect-metadata';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверный email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	name: string;
}
