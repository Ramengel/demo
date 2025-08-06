import { Contest, Fixture, Prediction, User } from '@prisma/client';
import { PredictionRepositoryInterface } from './prediction.repository.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { PrismaService } from '../db/prisma.service';
import { PredictionEntity } from './prediction.entity';
import { FixtureEntity } from '../fixture/fixture.entity';

@injectable()
export class PredictionRepository implements PredictionRepositoryInterface {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async deleteAllPredictions(): Promise<void> {
		await this.prismaService.client.prediction.deleteMany();
	}

	async clearePredictionContestBycontest_id(id: number): Promise<void> {
		await this.prismaService.client.prediction.deleteMany({
			where: {
				contest_id: id,
			},
		});
	}

	async getPredictionsResult(id: number): Promise<any> {
		return await this.prismaService.client.prediction.groupBy({
			by: ['user_id'],
			_sum: {
				prediction_result: true,
			},
			where: {
				contest_id: id,
			},
			orderBy: {
				_sum: {
					prediction_result: 'desc',
				},
			},
			take: 100,
		});
	}

	async findAll(): Promise<
		(Prediction & {
			contest: Contest | null;
			Fixture: Fixture | null;
			user: User | null;
		})[]
	> {
		return await this.prismaService.client.prediction.findMany({
			include: {
				contest: true,
				Fixture: true,
				user: true,
			},
		});
	}

	async createPrediction(prediction: PredictionEntity): Promise<Prediction | undefined | 'exists'> {
		try {
			return await this.prismaService.client.prediction.create({
				data: {
					user_id: prediction.user_id,
					contest_id: prediction.contest_id,
					Fixture_id: prediction.Fixture_id,
					home_scores: prediction.home_scores,
					guest_scores: prediction.guest_scores,
				},
			});
		} catch (err: any) {
			if (err?.meta?.target === 'PRIMARY') return 'exists';
			return undefined;
		}
	}

	async calculatePredictionResult(Fixture: FixtureEntity): Promise<void> {
		if (
			Fixture.status !== 'Fixture Finished' ||
			Fixture.home_scores === null ||
			Fixture.guest_scores === null
		) {
			return;
		}

		const predictions = await this.prismaService.client.prediction.findMany({
			where: {
				Fixture_id: Fixture.id,
				prediction_result: null,
			},
			include: {
				contest: true,
				Fixture: true,
				user: true,
			},
		});

		const actualResult = this.getFixtureOutcome(Fixture.home_scores, Fixture.guest_scores);

		for (const prediction of predictions) {
			const predictedResult = this.getFixtureOutcome(
				prediction.home_scores,
				prediction.guest_scores
			);

			let score = 0;
			if (predictedResult === actualResult) {
				score = 1;
				if (
					prediction.home_scores === Fixture.home_scores &&
					prediction.guest_scores === Fixture.guest_scores
				) {
					score = 3;
				}
			}

			await this.updatePredictionResult(prediction, score);
		}
	}

	private getFixtureOutcome(home: number, guest: number): 'win' | 'lose' | 'draw' {
		if (home > guest) return 'win';
		if (home < guest) return 'lose';
		return 'draw';
	}

	private async updatePredictionResult(prediction: any, score: number): Promise<void> {
		await this.prismaService.client.prediction.update({
			where: {
				contest_id_Fixture_id_user_id: {
					Fixture_id: prediction.Fixture_id,
					contest_id: prediction.contest_id,
					user_id: prediction.user_id,
				},
			},
			data: {
				prediction_result: score,
			},
		});
	}

}
