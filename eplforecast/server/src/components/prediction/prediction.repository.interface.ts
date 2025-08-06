import { Contest, Fixture, Prediction, User } from '@prisma/client';
import { FixtureEntity } from '../fixture/fixture.entity';

export interface PredictionRepositoryInterface {
	findAll(): Promise<
		(Prediction & {
			contest: Contest | null;
			Fixture: Fixture | null;
			user: User | null;
		})[]
	>;
	createPrediction(prediction: any): Promise<Prediction | undefined | 'exists'>;

	calculateprediction_result(Fixture: FixtureEntity): Promise<void>;

	getPredictionsResult(id: number): Promise<any[] | undefined>;

	clearePredictionContestBycontest_id(id: number): Promise<void>;

	deleteAllPredictions(): Promise<void>;
}
