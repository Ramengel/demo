import { ConfigServiceInterface } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { LoggerServiceInteface } from '../logger/logger.service.interface';

@injectable()
export class ConfigService implements ConfigServiceInterface {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.loggerService.error('[Config Service] - Error file env');
		} else {
			this.loggerService.info('[Config Service] -  env file setup');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
