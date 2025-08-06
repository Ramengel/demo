import { RedisServiceInterface } from './redis.service.interface';
import IORedis, { Redis } from 'ioredis';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { RedisClient } from 'ioredis/built/connectors/SentinelConnector/types';

@injectable()
export class RedisService implements RedisServiceInterface {
	_client: IORedis;
	constructor(@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface) {
		this._client = new Redis();
	}

	async getClient(): Promise<IORedis> {
		if (this._client === null) {
			this._client = new Redis();
		}

		return this._client;
	}
}
