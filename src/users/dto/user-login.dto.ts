import { IsEmail, IsString } from 'class-validator';
import 'reflect-metadata';

export class UserLoginDto {
	@IsEmail({}, { message: 'Некорректный email' })
	email: string;
	@IsString({ message: 'Не указан пароль' })
	password: string;
}
