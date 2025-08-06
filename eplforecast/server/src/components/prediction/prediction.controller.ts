import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { PredictionControllerInterface } from './prediction.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../types';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { GuardMiddleware } from '../common/guard.middlware';
import { PredictionCreateDTO } from './DTO/prediction-create.dto';
import { PredictionServiceInterface } from './prediction.service.interface';
import { HTTPError } from '../errors/http-error';
import { PredictionEntity } from './prediction.entity';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TGAuthMiddleware } from '../common/tg-auth.middleware';
import { TGValidateMiddleware } from '../common/tg-validate.middleware';
import * as validateMiddleware from '../common/validate.middleware';

@injectable()
export class PredictionController extends BaseController implements PredictionControllerInterface {
	constructor(
		@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.PredictionService) private predictionService: PredictionServiceInterface,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/prediction',
				method: 'post',
				func: this.createPrediction,
				middlewares: [
					new TGAuthMiddleware(this.configService.get('TG_TOKEN')),
					new TGValidateMiddleware(this.configService.get('TG_TOKEN')),

					new validateMiddleware.ValidateMiddleware(PredictionCreateDTO),
				],
				permissions: [],
			},
			{
				path: '/prediction',
				method: 'get',
				func: this.getAllPredictions,
				middlewares: [new GuardMiddleware()],
				permissions: [],
			},
		]);
	}

	async getAllPredictions(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const predictionRaw: PredictionEntity[] = await this.predictionService.findAll();

			const prediction = predictionRaw.map((prediction: PredictionEntity) => {
				return {
					user: prediction.user,
					user_id: prediction.user_id,
					contest: prediction.contest,
					contest_id: prediction.contest_id,
					Fixture: prediction.Fixture,
					Fixture_id: prediction.Fixture_id,
					home_scores: prediction.home_scores,
					guest_scores: prediction.guest_scores,
					prediction_result: prediction.prediction_result,
				};
			});

			this.ok(res, [...prediction]);
		} catch (err) {
			return next(new Error('Internal server error'));
		}
	}

	async createPrediction(
		req: Request<Record<string, unknown>, Record<string, unknown>, PredictionCreateDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.predictionService.createPrediction(req.body, req.initData.user.id);

			if (result == 'exists')
				return next(new HTTPError('Прогноз уже создан', 409, 'POST - create Prediction'));
			if (!result)
				return next(new HTTPError('Ошибка при создание прогноза', 409, 'POST - create Prediction'));

			if (result) {
				this.created(res, {
					data: result,
					message: 'Прогноз сделан',
				});
			} else {
				next(new HTTPError('Bad request', 400, 'POST - create Prediction'));
			}
		} catch (err) {
			next(new Error('Internal server error'));
		}
	}
}
