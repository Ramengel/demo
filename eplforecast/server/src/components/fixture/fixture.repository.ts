import { Fixture } from '@prisma/client';
import { FixtureRepositoryInterface } from './fixture.repository.interface';
import { injectable, inject } from 'inversify';
import { PrismaService } from '../db/prisma.service';
import { TYPES } from '../../types';
import { FixtureEntity } from './fixture.entity';

@injectable()
export class FixtureRepository implements FixtureRepositoryInterface {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async updateFixturestatus_parsetoParsed(id: number): Promise<void> {
		await this.prismaService.client.Fixture.update({
			where: {
				id,
			},
			data: {
				status_parse: true,
			},
		});
	}

	async clearcontest_idsBycontest_id(contest_id: number): Promise<void> {
		await this.prismaService.client.Fixture.updateMany({
			where: {
				contest_id,
			},
			data: {
				contest_id: null,
			},
		});
	}

	async clearcontest_idById(id: number, contest_id: number): Promise<void> {
		await this.prismaService.client.Fixture.update({
			where: {
				id,
			},
			data: {
				contest_id: null,
			},
		});
	}

	async updatecontest_idById(id: number, contest_id: number): Promise<void> {
		const res = await this.prismaService.client.Fixture.update({
			where: {
				id,
			},
			data: {
				contest_id,
			},
		});
	}

	async findById(id: number): Promise<Fixture | null> {
		return await this.prismaService.client.Fixture.findFirst({
			where: {
				id,
			},
		});
	}

	findByContest(id: number): Promise<Fixture[] | null> {
		throw new Error('Method not implemented.');
	}

	async findAll(): Promise<Fixture[]> {
		return await this.prismaService.client.Fixture.findMany();
	}

	async updateFixtures(fixtures: FixtureEntity[]): Promise<void> {
		for (const Fixture of fixtures) {
			await this.prismaService.client.Fixture.upsert({
				where: {
					Fixture_id: Fixture.Fixture_id,
				},
				update: {
					home_name: Fixture.home_name,
					guest_name: Fixture.guest_name,
					home_scores: Fixture.home_scores,
					guest_scores: Fixture.guest_scores,
					status: Fixture.status,
					date: Fixture.date,
				},
				create: {
					home_name: Fixture.home_name,
					guest_name: Fixture.guest_name,
					home_scores: Fixture.home_scores,
					guest_scores: Fixture.guest_scores,
					status: Fixture.status,
					date: Fixture.date,
					Fixture_id: Fixture.Fixture_id,
				},
			});
		}
	}
}
