import { IBaseFn } from '../common/baseController.interface';

export interface IUserController {
	login: IBaseFn;
	register: IBaseFn;
}
