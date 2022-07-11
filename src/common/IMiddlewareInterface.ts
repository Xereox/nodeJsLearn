import { IBaseFn } from './baseController.interface';

export interface IMiddlewareInterface {
	execute: IBaseFn;
}
