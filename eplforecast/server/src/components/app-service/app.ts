import express, { Express } from 'express';
import { Server } from 'http';
import { AppInterface } from './app.interface';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types';
import bodyParser, { json } from 'body-parser';
import { ExeptionFiltersInterface } from '../errors/exeption.filter.interface';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { PrismaServiceInterface } from '../db/prisma.service.interface';
import cors from 'cors';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { AuthMiddleware } from '../common/auth.middleware';
import { TGUserController } from '../tg-user/tg-users.controller';
import { ContestController } from '../contest/contest.controller';
import { FixtureController } from '../fixture/fixture.controller';
import { PredictionController } from '../prediction/prediction.controller';
import { WalletController } from '../wallet/wallet.controller';
import { AppManageController } from '../app-manager/AppManager.controller';


@injectable()
export class App implements AppInterface {
	app: Express;
	port: number;
	server: Server | undefined;

	constructor(
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFiltersInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.PrismaService) private prismaService: PrismaServiceInterface,
		@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface,
		@inject(TYPES.TGUserController) private tgUserController: TGUserController,
		@inject(TYPES.ContestController) private contestController: ContestController,
		@inject(TYPES.FixtureController) private FixtureController: FixtureController,
		@inject(TYPES.PredictionController) private predictionController: PredictionController,
		@inject(TYPES.WalletController) private walletController: WalletController,
		@inject(TYPES.AppManagerController) private appManagerConteoller: AppManageController,
	) {
		this.app = express();
		this.port = Number(configService.get('PORT'));
	}

	useRoutes(): void {
		this.app.use(express.static('public'));
		this.app.use('', this.appManagerConteoller.router);
		this.app.use('', this.tgUserController.router);
		this.app.use('', this.contestController.router);
		this.app.use('', this.FixtureController.router);
		this.app.use('', this.predictionController.router);
		this.app.use('', this.walletController.router);

	}

	useMiddleware(): void {
		this.app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
		this.app.use(json({ limit: '50mb' }));
		this.app.use(cors());

		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();

		this.server = this.app.listen(this.port);
		this.loggerService.info(`App runs on port ${this.port}`);
	}

	async close(): Promise<void> {
		this.server?.close();
		await this.prismaService.disconnect();
	}
}
