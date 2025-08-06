import { injectable, inject } from 'inversify';
import { PredictionCreateDTO } from './DTO/prediction-create.dto';
import { PredictionEntity } from './prediction.entity';
import { PredictionServiceInterface } from './prediction.service.interface';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { PredictionRepositoryInterface } from './prediction.repository.interface';
import { Contest, Fixture, Prediction, User } from '@prisma/client';
import { FixtureServiceInterface } from '../fixture/fixture.service.interface';

@injectable()
export class PredictionService implements PredictionServiceInterface {
	constructor(
		@inject(TYPES.PredictionRepository) private predictionRepository: PredictionRepositoryInterface,
		@inject(TYPES.FixtureService) private FixtureService: FixtureServiceInterface,
	) {}

	async deleteAllPredictions(): Promise<void> {
		await this.predictionRepository.deleteAllPredictions();
	}

	async clearPredictionContest(contestId: number): Promise<void> {
		await this.predictionRepository.clearePredictionContestBycontest_id(contestId);
	}

	async findAll(): Promise<PredictionEntity[]> {
		const predictions = await this.predictionRepository.findAll();
		return predictions.map((p) => this.mapToEntity(p));
	}

	async getPredictionsResult(contestId: number): Promise<any[] | undefined> {
		return this.predictionRepository.getPredictionsResult(contestId);
	}

	async createPrediction(
		prediction: PredictionCreateDTO,
		userId: number,
	): Promise<Prediction | undefined | 'exists'> {
		const { Fixture_id, contest_id, home_scores, guest_scores } = prediction;

		const Fixture = await this.FixtureService.findById(Fixture_id);
		if (!this.isFixtureAvailableForPrediction(Fixture)) return undefined;

		const predictionEntity = this.createEntity({
			user_id: userId,
			contest_id,
			Fixture_id,
			home_scores,
			guest_scores,
			prediction_result: null,
		});

		return this.predictionRepository.createPrediction(predictionEntity);
	}

	async calculatePredictionResult(Fixture: Fixture): Promise<void> {
		const FixtureEntity = this.FixtureService.createFixtureEntity(Fixture);
		await this.predictionRepository.calculateprediction_result(FixtureEntity);
		await this.FixtureService.updateFixturestatus_parsetoParsed(FixtureEntity.id);
	}

	private isFixtureAvailableForPrediction(Fixture: Fixture | null): boolean {
		if (!Fixture) return false;
		if (Fixture.status !== 'Not Started') return false;

		const FixtureDate = new Date(Fixture.date).getTime();
		const now = Date.now();
		const twoDaysMs = 172800000;

		return FixtureDate - twoDaysMs <= now;
	}

	private createEntity(data: {
		user_id: number;
		contest_id: number;
		Fixture_id: number;
		home_scores: number;
		guest_scores: number;
		prediction_result: number | null;
		user?: any;
		Fixture?: any;
		contest?: any;
	}): PredictionEntity {
		return new PredictionEntity(
			data.user_id,
			data.user ?? null,
			data.contest_id,
			data.contest ?? null,
			data.Fixture_id,
			data.Fixture ?? null,
			data.home_scores,
			data.guest_scores,
			data.prediction_result,
		);
	}

	private mapToEntity(prediction: Prediction & {
		contest: Contest | null;
		Fixture: Fixture | null;
		user: User | null;
	}): PredictionEntity {
		return this.createEntity({
			user_id: prediction.user_id,
			user: prediction.user,
			contest_id: prediction.contest_id,
			contest: prediction.contest,
			Fixture_id: prediction.Fixture_id,
			Fixture: prediction.Fixture,
			home_scores: prediction.home_scores,
			guest_scores: prediction.guest_scores,
			prediction_result: prediction.prediction_result,
		});
	}
}

