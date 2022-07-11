import { compare, hash } from 'bcryptjs';
export class User {
	private _password: string;
	constructor(private _email: string, private _name: string) {}

	public static async comparePassword(st: string, hash: string) {
		return await compare(st, hash);
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	public setPassword = async (pass: string, salt: number): Promise<void> => {
		this._password = await hash(pass, salt);
	};
}
