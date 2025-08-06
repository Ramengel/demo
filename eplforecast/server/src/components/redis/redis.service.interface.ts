import IORedis from 'ioredis';

export interface RedisServiceInterface {
	getClient(): Promise<IORedis>;
}
