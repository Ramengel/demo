import { Fixture, Prediction } from '@prisma/client';
import { PredictionCreateDTO } from './DTO/prediction-create.dto';
import { PredictionEntity } from './prediction.entity';

export interface PredictionServiceInterface {
	findAll(): Promise<PredictionEntity[]>;
	createPrediction(
		prediction: PredictionCreateDTO,
		user_id: number,
	): Promise<Prediction | undefined | 'exists'>;
	getPredictionsResult(id: number): Promise<any[] | undefined>;
	calculateprediction_result(Fixture: Fixture): Promise<void>;
	clearePredictionContestBycontest_id(id: number): Promise<void>;
	deleteAllPredictions(): Promise<void>;
}
