import { ContestEntity } from './contest.entity';
import { ContestCreateDTO } from './DTO/contest-create.dto';
import { ContestUpdateDTO } from './DTO/contest-update.dto';

export interface ContestServiceInterface {
	findAll(): Promise<ContestEntity[]>;
	findContestById(id: number): Promise<ContestEntity | null>;
	createContest(Contest: ContestCreateDTO): Promise<ContestEntity | undefined>;
	deleteContest(id: number): Promise<boolean>;
	updateContest(Contest: ContestUpdateDTO): Promise<ContestEntity | undefined>;
	findActiveContest(): Promise<ContestEntity | null>;
	findActiveContestWithNotParsedFixture(): Promise<ContestEntity | null>;
	calculateActiveContest(): Promise<string>;
	calculateround_points(): Promise<void>;
}
