import { IsString, IsNotEmpty, Boolean, MinLength, MaxLength } from 'class-validator';

export class ContestCreateDTO {
	@IsString()
	@MinLength(3)
	@MaxLength(254)
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	content: string;

	@Boolean
	active: boolean;

	@IsString()
	@IsNotEmpty()
	start_contest: string;

	@IsString()
	@IsNotEmpty()
	end_contest: string;
	fixtures: [];
}
