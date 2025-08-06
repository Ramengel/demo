import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { ExeptionFiltersInterface } from './exeption.filter.interface';
import { HTTPError } from './http-error';

@injectable()
export class ExeptionFilters implements ExeptionFiltersInterface {
	constructor(@inject(TYPES.LoggerService) private logger: LoggerServiceInteface) {}
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(
				`StatusCode: ${err.statusCode} - Message: ${err.message}, Context - ${err.context} `,
			);
			res.status(err.statusCode).send({
				message: err.message,
			});
		} else {
			res.status(500).send({
				message: err.message,
			});
		}
	}
}
