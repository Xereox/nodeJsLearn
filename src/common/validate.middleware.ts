import { IBaseFn } from './baseController.interface';
import { IMiddlewareInterface } from './IMiddlewareInterface';
import { Req } from '../users/users.controller';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddlewareInterface {
	constructor(private classToValidate: ClassConstructor<object>) {}
	execute: IBaseFn = ({ body }: Req<UserRegisterDto>, res, next) => {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance).then((e) => {
			if (e.length) {
				res.status(422).send(e.map((x) => x.constraints));
			} else next();
		});
	};
}
