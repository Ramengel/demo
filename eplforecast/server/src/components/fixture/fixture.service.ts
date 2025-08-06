import { FixtureEntity } from './fixture.entity';
import { FixtureServiceInterface } from './fixture.service.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { TYPES } from '../../types';
import { Fixture } from '@prisma/client';
import { FixtureRepositoryInterface } from './fixture.repository.interface';
import { FixtureInterface } from '../../types/FixtureTypes';

@injectable()
export class MathcService implements FixtureServiceInterface {
	constructor(
		@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface,
		@inject(TYPES.FixtureRepository) private FixtureRepository: FixtureRepositoryInterface,
	) {}

	async updateFixturestatus_parsetoParsed(id: number): Promise<void> {
		await this.FixtureRepository.updateFixturestatus_parsetoParsed(id);
	}

	async clearcontest_idsBycontest_id(contest_id: number): Promise<void> {
		await this.FixtureRepository.clearcontest_idsBycontest_id(contest_id);
	}

	async updatecontest_idById(id: number, Fixture_id: number): Promise<void> {
		await this.FixtureRepository.updatecontest_idById(id, Fixture_id);
	}

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
		contest: any = null,
	): FixtureEntity {
		return new FixtureEntity(
			Number(Fixture.id),
			Fixture.Fixture_id,
			Fixture.home_name,
			Fixture.guest_name,
			Fixture.home_scores,
			Fixture.guest_scores,
			Fixture.status,
			Fixture.status_parse,
			Fixture.date,
			contest,
		);
	}

	async findAll(): Promise<FixtureEntity[]> {
		const FixtureAll = await this.FixtureRepository.findAll();
		return FixtureAll.map((Fixture: Fixture) => {
			return this.createFixtureEntity({
				id: Fixture.id,
				Fixture_id: Fixture.Fixture_id,
				home_name: Fixture.home_name,
				guest_name: Fixture.guest_name,
				home_scores: Fixture.home_scores ?? 0,
				guest_scores: Fixture.guest_scores ?? 0,
				date: Fixture.date,
				status: Fixture.status,
				status_parse: Fixture.status_parse,
			});
		});
	}

	async findById(id: number): Promise<FixtureEntity | null> {
		const Fixture = await this.FixtureRepository.findById(id);

		if (Fixture)
			return this.createFixtureEntity({
				id: Fixture.id,
				Fixture_id: Fixture.Fixture_id,
				home_name: Fixture.home_name,
				guest_name: Fixture.guest_name,
				home_scores: Fixture.home_scores ?? 0,
				guest_scores: Fixture.guest_scores ?? 0,
				date: Fixture.date,
				status: Fixture.status,
				status_parse: Fixture.status_parse,
			});

		return Fixture;
	}

	async findByContest(id: number): Promise<FixtureEntity[] | null> {
		throw new Error('Method not implemented.');
	}

	async updateFixtures(fixtures: { response: FixtureInterface[] }): Promise<void> {
		const { response: fixtures } = fixtures;

		const fixturesEntities: FixtureEntity[] = fixtures.map((Fixture: FixtureInterface) => {
			return this.createFixtureEntity({
				id: 1,
				Fixture_id: Fixture.fixture.id,
				home_name: Fixture.teams.home.name,
				guest_name: Fixture.teams.away.name,
				home_scores: Fixture.goals.home,
				guest_scores: Fixture.goals.away,
				status: Fixture.fixture.status.long,
				status_parse: false,
				date: new Date(Fixture.fixture.date),
			});
		});

		this.FixtureRepository.updateFixtures(fixturesEntities);
	}
}
