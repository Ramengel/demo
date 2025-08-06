import { LoggerServiceInteface } from './logger.service.interface';
import { Logger } from 'tslog';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService implements LoggerServiceInteface {
	logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayLoggerName: false,
			displayFunctionName: false,
			displayDateTime: true,
			displayFilePath: 'hidden',
		});
	}

	log(msg: string): void {
		this.logger.silly(msg);
	}

	info(msg: string): void {
		this.logger.info(msg);
	}

	warn(msg: string): void {
		this.logger.warn(msg);
	}

	error(msg: string): void {
		this.logger.error(msg);
	}
}
