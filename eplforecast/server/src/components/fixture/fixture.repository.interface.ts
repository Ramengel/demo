import { Fixture } from '@prisma/client';
import { FixtureEntity } from './fixture.entity';

export interface FixtureRepositoryInterface {
	findById(id: number): Promise<Fixture | null>;
	findByContest(id: number): Promise<Fixture[] | null>;
	findAll(): Promise<Fixture[]>;
	updateFixtures(fixtures: FixtureEntity[]): Promise<void>;
	updatecontest_idById(id: number, contest_id: number): Promise<void>;
	clearcontest_idsBycontest_id(contest_id: number): Promise<void>;
	clearcontest_idById(id: number, contest_id: number): Promise<void>;
	updateFixturestatus_parsetoParsed(id: number): Promise<void>;
}
