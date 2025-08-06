import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { FixtureControllerInterface } from './fixture.controller.interface';
import { TYPES } from '../../types';
import { Request, Response, NextFunction } from 'express';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { ContestServiceInterface } from '../contest/contest.service.interface';
import { HTTPError } from '../errors/http-error';
import { FixtureServiceInterface } from './fixture.service.interface';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { FixtureEntity } from './fixture.entity';

@injectable()
export class FixtureController extends BaseController implements FixtureControllerInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface,
		@inject(TYPES.FixtureService) private FixtureService: FixtureServiceInterface,
		@inject(TYPES.ContestService) private contestService: ContestServiceInterface,
	) {
		super(loggerService);

		this.bindRoutes([
		{
			path: '/fixtures',
			method: 'get',
			func: this.getFixtures,
			middlewares: [
			],
			permissions: [
			],
		},
		{
			path: '/fixtures',
			method: 'post',
			func: this.updateFixtures,
			middlewares: [],
			permissions: [],
		},
	]);
	}

	async getFixtureById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			if (isNaN(id)) {
				return next(new HTTPError('Invalid Fixture ID', 400, 'GET - getFixtureById'));
			}

			const Fixture = await this.FixtureService.findById(id);
			if (!Fixture) {
				return next(new HTTPError('Fixture not found', 404, 'GET - getFixtureById'));
			}

			this.ok(res, { data: Fixture });
		} catch (err) {
			next(new HTTPError('Internal server error', 500, 'GET - getFixtureById'));
		}
	}

	async getFixtures(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const fixtures = await this.FixtureService.findAll();

			const formatted = fixtures.map((m) => ({
				id: m.id,
				Fixture_id: m.Fixture_id,
				home_name: m.home_name,
				guest_name: m.guest_name,
				home_scores: m.home_scores,
				guest_scores: m.guest_scores,
				date: m.date,
				status: m.status,
				status_parse: m.status_parse,
				name: `${m.home_name} - ${m.guest_name} - ${m.date.getDate()}/${m.date.getMonth() + 1}/${m.date.getFullYear()} - ${m.status.toUpperCase()}`,
			}));

			this.ok(res, formatted);
		} catch {
			next(new HTTPError('Internal server error', 500, 'GET - getFixtures'));
		}
	}

	async updateFixtures(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { fixtures, pc } = req.body;

			if (pc !== this.configService.get('PC')) {
				return next(new HTTPError('Forbidden', 403, 'POST - updateFixtures'));
			}

			await this.FixtureService.updateFixtures(fixtures);
			await this.contestService.calculateActiveContest();

			this.ok(res, { message: 'Fixtures updated successfully' });
		} catch {
			next(new HTTPError('Internal server error', 500, 'POST - updateFixtures'));
		}
	}

	getFixturesByContest(req: Request, res: Response, next: NextFunction): Promise<void> {
		next(new HTTPError('Method not implemented', 501, 'GET - getFixturesByContest'));
	}
}

