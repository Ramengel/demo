import { injectable, inject } from 'inversify';
import { ContestEntity } from './contest.entity';
import { ContestServiceInterface } from './contest.service.interface';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { Contest, Fixture } from '@prisma/client';
import { ContestRepositoryInterface } from './contest.repository.interface';
import { ContestCreateDTO } from './DTO/contest-create.dto';
import { ContestUpdateDTO } from './DTO/contest-update.dto';
import { FixtureServiceInterface } from '../fixture/fixture.service.interface';
import { PredictionServiceInterface } from '../prediction/prediction.service.interface';
import { TGUserRepository } from '../tg-user/tg-users.repository';
@injectable()

export class ContestService implements ContestServiceInterface {
	constructor(
		@inject(TYPES.ContestRepository) private contestRepository: ContestRepositoryInterface,
		@inject(TYPES.FixtureService) private FixtureService: FixtureServiceInterface,
		@inject(TYPES.PredictionService) private predictionService: PredictionServiceInterface,
		@inject(TYPES.TGUserRepository) private tgUserRepository: TGUserRepository,
	) {}

	private async updateUserPointsFromPredictions(contestId: number, roundMode = false): Promise<void> {
		const predictions = await this.predictionService.getPredictionsResult(contestId);
		if (!predictions) return;

		let i = 0;
		for (const user of predictions) {
			if (roundMode) {
				await this.tgUserRepository.putRoundData(user.user_id, i, user._sum.prediction_result);
				i++;
			} else {
				await this.tgUserRepository.putTotalround_points(user.user_id, user._sum.prediction_result);
			}
		}
	}

	async calculateround_points(): Promise<void> {
		const activeContest = await this.findActiveContestWithNotParsedFixture();
		if (activeContest) {
			await this.updateUserPointsFromPredictions(activeContest.id);
		}
	}

	async calculateActiveContest(): Promise<string> {
		const activeContest = await this.findActiveContestWithNotParsedFixture();
		if (!activeContest) return 'Нет активного конкурса';

		for (const Fixture of activeContest.fixtures as Fixture[]) {
			if (!Fixture.status_parse && Fixture.status === Fixture_STATUS_FINISHED) {
				await this.predictionService.calculateprediction_result(Fixture);
				await this.updateUserPointsFromPredictions(activeContest.id, true);
			}
		}

		return 'Удачное обновление';
	}

	async findActiveContest(): Promise<ContestEntity | null> {
		const contest = await this.contestRepository.findActiveContest();
		return contest ? this.createContestEntity(contest) : null;
	}

	async findActiveContestWithNotParsedFixture(): Promise<ContestEntity | null> {
		const contest = await this.contestRepository.findActiveContestWithNotParsedFixture();
		return contest ? this.createContestEntity(contest) : null;
	}

	createContestEntity(contest: Contest & { fixtures?: any[] }): ContestEntity {
		return new ContestEntity(
			contest.title,
			contest.content,
			contest.active,
			contest.end_contest,
			contest.start_contest,
			contest.id,
			contest.fixtures ?? [],
		);
	}


	async findAll(): Promise<ContestEntity[]> {
		const contests = await this.contestRepository.findAll();
		return contests.map(c => this.createContestEntity(c));
	}

	async findContestById(id: number): Promise<ContestEntity | null> {
		const contest = await this.contestRepository.findById(id);
		return contest ? this.createContestEntity(contest) : null;
	}

	async createContest(contest: ContestCreateDTO): Promise<ContestEntity | null> {
		const entity = this.createContestEntity({
			id: 0,
			title: contest.title,
			content: contest.content,
			active: contest.active,
			end_contest: new Date(contest.end_contest),
			start_contest: new Date(contest.start_contest),
			fixtures: contest.fixtures,
		});

		const result = await this.contestRepository.createContest(entity);
		if (!result) return null;

		if (entity.active) {
			await this.contestRepository.setInActiveContests(result.id);
		}
		for (const FixtureId of contest.fixtures) {
			await this.FixtureService.updatecontest_idById(FixtureId, result.id);
		}

		return entity;
	}

	async deleteContest(id: number): Promise<boolean> {
		await this.FixtureService.clearcontest_idsBycontest_id(id);
		await this.predictionService.clearePredictionContestBycontest_id(id);
		return await this.contestRepository.deleteContest(id);
	}

	async updateContest(contest: ContestUpdateDTO): Promise<ContestEntity | null> {
		const entity = this.createContestEntity({
			id: contest.id,
			title: contest.title,
			content: contest.content,
			active: contest.active,
			end_contest: new Date(contest.end_contest),
			start_contest: new Date(contest.start_contest),
			fixtures: contest.fixtures,
		});

		const result = await this.contestRepository.updateContest(entity);
		if (!result) return null;

		await this.FixtureService.clearcontest_idsBycontest_id(contest.id);
		if (entity.active) {
			await this.contestRepository.setInActiveContests(result.id);
		}
		for (const FixtureId of contest.fixtures) {
			await this.FixtureService.updatecontest_idById(FixtureId, result.id);
		}

		return entity;
	}
}

