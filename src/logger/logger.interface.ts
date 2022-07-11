type LoggerFnType = (...args: unknown[]) => void;

export interface ILogger {
	logger: unknown;
	log: LoggerFnType;
	warn: LoggerFnType;
	error: LoggerFnType;
}
