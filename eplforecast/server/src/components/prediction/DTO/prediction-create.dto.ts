import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class PredictionCreateDTO {
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(1000000)
	contest_id: number;

	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(10000000)
	Fixture_id: number;
	
	@IsNumber()
	@Max(100)
	@IsNotEmpty()
	home_scores: number;
	
	@IsNumber()
	@Min(0)
	@Max(100)
	@IsNotEmpty()
	guest_scores: number;
}
