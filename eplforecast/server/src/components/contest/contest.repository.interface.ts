import { Contest, Fixture } from '@prisma/client';
import { ContestEntity } from './contest.entity';

export interface ContestRepositoryInterface {
	findById(id: number): Promise<Contest | null>;
	findAll(): Promise<Contest[]>;
	findActiveContest(): Promise<
		| (Contest & {
				fixtures: Fixture[];
		  })
		| null
	>;
	findActiveContestWithNotParsedFixture(): Promise<
		| (Contest & {
				fixtures: Fixture[];
		  })
		| null
	>;
	createContest(contest: ContestEntity): Promise<Contest | undefined>;
	deleteContest(id: number): Promise<Contest | null>;
	updateContest(contest: ContestEntity): Promise<Contest>;
	setInActiveContests(id: number): Promise<void>;
}
