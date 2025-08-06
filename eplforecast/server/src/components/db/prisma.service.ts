import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { PrismaServiceInterface } from './prisma.service.interface';

@injectable()
export class PrismaService implements PrismaServiceInterface {
	client: PrismaClient;

	constructor(@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.info('[Prisma service] Success db connect');
		} catch (err) {
			if (err instanceof Error)
				this.loggerService.error(`[Prisma service] Error db connect ${err}`);
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
