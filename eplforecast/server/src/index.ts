import { App } from './components/app-service/app';
import { Container } from 'inversify';
import { TYPES } from './types';
import { LoggerService } from './components/logger/logger.service';
import { LoggerServiceInteface } from './components/logger/logger.service.interface';
import { ExeptionFilters } from './components/errors/exeption.filters';

import { ConfigServiceInterface } from './components/config/config.service.interface';
import { ExeptionFiltersInterface } from './components/errors/exeption.filter.interface';
import { ConfigService } from './components/config/config.service';
import { PrismaService } from './components/db/prisma.service';
import { PrismaServiceInterface } from './components/db/prisma.service.interface';

import { RedisServiceInterface } from './components/redis/redis.service.interface';
import { RedisService } from './components/redis/redis.service';
import TGUserControllerInterface from './components/tg-user/tg-users.controller.interface';
import { TGUserController } from './components/tg-user/tg-users.controller';
import { TGUserServiceInterface } from './components/tg-user/tg-users.service.interface';
import { TGUserService } from './components/tg-user/tg-users.service';
import { TGUserRepositoryInterface } from './components/tg-user/tg-users.repository.interface';
import { TGUserRepository } from './components/tg-user/tg-users.repository';
import { ContestService } from './components/contest/contest.service';
import { ContestServiceInterface } from './components/contest/contest.service.interface';
import { ContestRepository } from './components/contest/contest.repository';
import { ContestRepositoryInterface } from './components/contest/contest.repository.interface';
import { ContestController } from './components/contest/contest.controller';
import { ContestControllerInterface } from './components/contest/contest.controller.interface';
import { FixtureControllerInterface } from './components/fixture/fixture.controller.interface';
import { FixtureController } from './components/fixture/fixture.controller';
import { FixtureServiceInterface } from './components/fixture/fixture.service.interface';
import { MathcService } from './components/fixture/fixture.service';
import { FixtureRepositoryInterface } from './components/fixture/fixture.repository.interface';
import { FixtureRepository } from './components/fixture/fixture.repository';
import { PredictionControllerInterface } from './components/prediction/prediction.controller.interface';
import { PredictionController } from './components/prediction/prediction.controller';
import { PredictionServiceInterface } from './components/prediction/prediction.service.interface';
import { PredictionService } from './components/prediction/prediction.service';
import { PredictionRepositoryInterface } from './components/prediction/prediction.repository.interface';
import { PredictionRepository } from './components/prediction/prediction.repository';
import { TGBotServiceInterface } from './components/tg-bot/tg-bot.service.interface';
import { TGBotService } from './components/tg-bot/tg-bot-service';

const bootstrap = async (): Promise<void> => {
	const container = new Container();
	container.bind<RedisServiceInterface>(TYPES.RedisService).to(RedisService).inSingletonScope();


	container
		.bind<PredictionControllerInterface>(TYPES.PredictionController)
		.to(PredictionController)
		.inSingletonScope();
	container
		.bind<PredictionServiceInterface>(TYPES.PredictionService)
		.to(PredictionService)
		.inSingletonScope();
	container
		.bind<PredictionRepositoryInterface>(TYPES.PredictionRepository)
		.to(PredictionRepository)
		.inSingletonScope();

	container
		.bind<FixtureControllerInterface>(TYPES.FixtureController)
		.to(FixtureController)
		.inSingletonScope();
	container.bind<FixtureServiceInterface>(TYPES.FixtureService).to(MathcService).inSingletonScope();
	container
		.bind<FixtureRepositoryInterface>(TYPES.FixtureRepository)
		.to(FixtureRepository)
		.inSingletonScope();

	container
		.bind<TGUserControllerInterface>(TYPES.TGUserController)
		.to(TGUserController)
		.inSingletonScope();
	container.bind<TGUserServiceInterface>(TYPES.TGUserService).to(TGUserService).inSingletonScope();
	container
		.bind<TGUserRepositoryInterface>(TYPES.TGUserRepository)
		.to(TGUserRepository)
		.inSingletonScope();

	container
		.bind<ContestServiceInterface>(TYPES.ContestService)
		.to(ContestService)
		.inSingletonScope();
	container
		.bind<ContestRepositoryInterface>(TYPES.ContestRepository)
		.to(ContestRepository)
		.inSingletonScope();
	container
		.bind<ContestControllerInterface>(TYPES.ContestController)
		.to(ContestController)
		.inSingletonScope();

	container.bind<LoggerServiceInteface>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	container
		.bind<ExeptionFiltersInterface>(TYPES.ExeptionFilter)
		.to(ExeptionFilters)
		.inSingletonScope();

	container.bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	container.bind<PrismaServiceInterface>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	container.bind<App>(TYPES.AppService).to(App).inSingletonScope();

	container.bind<TGBotServiceInterface>(TYPES.TGBotService).to(TGBotService).inSingletonScope();

	const app = container.get<App>(TYPES.AppService);
	app.init();
};

bootstrap();
