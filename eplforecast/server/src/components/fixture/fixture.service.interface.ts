import { FixtureInterface } from '../../types/FixtureTypes';
import { FixtureEntity } from './fixture.entity';

export interface FixtureServiceInterface {
	findAll(): Promise<FixtureEntity[]>;
	findById(id: number): Promise<FixtureEntity | null>;
	updatecontest_idById(id: number, Fixture_id: number): Promise<void>;
	clearcontest_idsBycontest_id(contest_id: number): Promise<void>;
	findByContest(id: number, contest_id: number): Promise<FixtureEntity[] | null>;
	updateFixtures(fixtures: { response: FixtureInterface[] }): Promise<void>;
	updateFixturestatus_parsetoParsed(id: number): Promise<void>;
	createFixtureEntity(
		Fixture: {
			id: number;
			Fixture_id: number;
			home_name: string;
			guest_name: string;
			home_scores: number | null;
			guest_scores: number | null;
			status: string;
			status_parse: boolean;
			date: Date;
		},
		contest?: any,
	): FixtureEntity;
}
