import { IsString, IsNotEmpty, Boolean, MinLength, MaxLength } from 'class-validator';

type active = 'true' | 'false';
export const isActive: active[] = ['true', 'false'];

export class ContestUpdateDTO {
	@IsString()
	id: string;

	@IsString()
	@MinLength(3)
	@MaxLength(254)
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	content: string;

	@Boolean()
	active: boolean;

	@IsString()
	@IsNotEmpty()
	start_contest: string;

	@IsString()
	@IsNotEmpty()
	end_contest: string;

	fixtures: [];
}
