import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { ContestControllerInterface } from './contest.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import 'reflect-metadata';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { ContestServiceInterface } from './contest.service.interface';
import { HTTPError } from '../errors/http-error';
import * as validateMiddleware from '../common/validate.middleware';
import { ContestEntity } from './contest.entity';
import { ContestUpdateDTO } from './DTO/contest-update.dto';
import { ContestCreateDTO } from './DTO/contest-create.dto';
import { GuardMiddleware } from '../common/guard.middlware';
import { Fixture } from '@prisma/client';
import { PredictionServiceInterface } from '../prediction/prediction.service.interface';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TGUserServiceInterface } from '../tg-user/tg-users.service.interface';

@injectable()
export class ContestController extends BaseController implements ContestControllerInterface {
	constructor(
		@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface,
		@inject(TYPES.ContestService) private contestService: ContestServiceInterface,
		@inject(TYPES.PredictionService) private predictionService: PredictionServiceInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.TGUserService) private tgUserService: TGUserServiceInterface,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/contest/active',
				method: 'get',
				func: this.getActiveContest,
				middlewares: [],
				permissions: [],
			},
			{
				path: '/contests',
				method: 'get',
				func: this.getContests,
				middlewares: [],
				permissions: [],
			},
			{
				path: '/contest/id/:id',
				method: 'get',
				func: this.getContestById,
				middlewares: [],
				permissions: [],
			},

			{
				path: '/contest',
				method: 'post',
				func: this.createContest,
				middlewares: [
					new GuardMiddleware(),
					new validateMiddleware.ValidateMiddleware(ContestCreateDTO),
				],
				permissions: [],
			},
			{
				path: '/contest/:id',
				method: 'put',
				func: this.updateContest,
				middlewares: [
					new GuardMiddleware(),
					new validateMiddleware.ValidateMiddleware(ContestUpdateDTO),
				],
				permissions: [],
			},
			{
				path: '/contest/:id',
				method: 'delete',
				func: this.deleteContest,
				middlewares: [new GuardMiddleware()],
				permissions: [],
			},
			{
				path: '/contest/calculate-contest-predictions',
				method: 'get',
				func: this.calculateActiveContestFixturePredictions,
				middlewares: [],
				permissions: [],
			},

			{
				path: '/contest/active-contest-predictions/:pc',
				method: 'get',
				func: this.getActiveContestPredictions,
				middlewares: [],
				permissions: [],
			},
		]);
	}

	async calculateActiveContestFixturePredictions(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const activeContest = await this.contestService.findActiveContestWithNotParsedFixture();
			if (activeContest) {
				const { id, fixtures } = activeContest;

				for (const Fixture of fixtures as Fixture[]) {
					if (Fixture.status_parse === false && Fixture.status === 'Fixture Finished') {
						await this.predictionService.calculateprediction_result(Fixture);
					}
				}
			}

			this.ok(res, { message: 'Удачное обновление' });
		} catch (err) {
			next(new Error('Internal server error'));
		}
	}

	async getContestById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;

			if (!id) {
				return next(new HTTPError('Contest not found', 404, 'GET - getContestById'));
			} else {
				const contest = await this.contestService.findContestById(Number(id));

				if (!contest) {
					return next(new HTTPError('contest not found', 404, 'GET - getContestById'));
				} else {
					const fixtures = contest.fixtures?.map((Fixture: Fixture) => Fixture.id);

					this.ok(res, {
						contest: {
							id: contest.id,
							title: contest.title,
							content: contest.content,
							active: contest.active,
							start_contest: contest.start_contest,
							end_contest: contest.end_contest,
							Fixture: fixtures,
						},
					});
				}
			}
		} catch (err) {
			return next(new Error('Internal server error'));
		}
	}

	async getActiveContestPredictions(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { pc } = req.params;

			if (pc !== this.configService.get('PC')) {
				next(new Error('Internal server error'));
			}

			const contestRaw = await this.contestService.findActiveContest();

			if (!contestRaw || !contestRaw.id) {
				this.ok(res, []);
			} else {
				const predictionsRaw = await this.predictionService.getPredictionsResult(contestRaw.id);

				const prediction = await this.tgUserService.getUsersByid(predictionsRaw);
				this.ok(res, prediction);
			}
		} catch (err) {
			return next(new Error('Internal server error'));
		}
	}

	async getActiveContest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const contestRaw = await this.contestService.findActiveContest();

			if (!contestRaw) {
				this.ok(res, []);
			} else {
				const fixtures = contestRaw?.fixtures.map((Fixture: Fixture) => {
					return {
						id: Fixture.id,
						Fixture_id: Fixture.Fixture_id,
						status: Fixture.status,
						home_name: Fixture.home_name,
						guest_name: Fixture.guest_name,
						home_scores: Fixture.home_scores,
						guest_scores: Fixture.guest_scores,
						date: Fixture.date,
					};
				});
				this.ok(res, [
					{
						title: contestRaw.title,
						content: contestRaw.content,
						active: contestRaw.active,
						end_contest: contestRaw.end_contest,
						start_contest: contestRaw.start_contest,
						id: contestRaw.id,
						fixtures,
					},
				]);
			}
		} catch (err) {
			return next(new Error('Internal server error'));
		}
	}

	async getContests(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const contestsRaw: ContestEntity[] = await this.contestService.findAll();

			const contests = contestsRaw.map((contest: ContestEntity) => {
				return {
					id: contest.id,
					title: contest.title,
					content: contest.content,
					active: contest.active,
					startContent: contest.start_contest,
					endContent: contest.end_contest,
				};
			});

			this.ok(res, [...contests]);
		} catch (err) {
			return next(new Error('Internal server error'));
		}
	}

	async createContest(
		req: Request<Record<string, unknown>, Record<string, unknown>, ContestCreateDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.contestService.createContest(req.body);
			if (!result)
				return next(new HTTPError('Contest create failed', 409, 'POST - create Contest'));

			if (result) {
				this.created(res, {
					data: {
						id: result.id,
						title: result.title,
					},
					message: 'Contest was created',
				});
			} else {
				next(new HTTPError('Bad request', 400, 'POST - create Contest'));
			}
		} catch (err) {
			next(new Error('Internal server error'));
		}
	}

	async updateContest(
		req: Request<Record<string, unknown>, Record<string, unknown>, ContestUpdateDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.contestService.updateContest(req.body);

			if (!result)
				return next(new HTTPError('Contest updaet failed', 409, 'POST - update Contest'));

			if (result) {
				this.ok(res, {
					data: result,
					message: 'Contest was updated',
				});
			} else {
				next(new HTTPError('Bad request', 400, 'POST - deleteContest'));
			}
		} catch (err) {
			next(new Error('Internal server error'));
		}
	}

	async deleteContest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;

			if (!id) return next(new HTTPError('Contest not found', 404, 'POST - deleteContest'));

			const result = await this.contestService.deleteContest(Number(id));

			if (result) {
				this.ok(res, {
					message: 'Contest was deleted',
				});
			} else {
				next(new HTTPError('Bad request', 400, 'POST - deleteContest'));
			}
		} catch (err) {
			next(new Error('Internal server error'));
		}
	}
}
