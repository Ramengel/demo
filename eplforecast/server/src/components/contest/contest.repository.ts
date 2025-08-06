import { Contest, Fixture } from '@prisma/client';
import { ContestEntity } from './contest.entity';
import { ContestRepositoryInterface } from './contest.repository.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../db/prisma.service';
import { TYPES } from '../../types';

@injectable()
export class ContestRepository implements ContestRepositoryInterface {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async getContestprediction_result(): Promise<any> {
		
	}

	async findActiveContestWithNotParsedFixture(): Promise<
		| (Contest & {
				fixtures: Fixture[];
		  })
		| null
	> {
		return await this.prismaService.client.contest.findFirst({
			where: {
				active: true,
				fixtures: {
					some: {
						status_parse: false,
					},
				},
			},
			include: {
				fixtures: true,
			},
		});
	}

	async findActiveContest(): Promise<
		| (Contest & {
				fixtures: Fixture[];
		  })
		| null
	> {
		return await this.prismaService.client.contest.findFirst({
			where: {
				active: true,
			},
			include: {
				fixtures: true,
			},
		});
	}

	async setInActiveContests(id: number): Promise<void> {
		await this.prismaService.client.contest.updateMany({
			where: {
				NOT: {
					id,
				},
			},
			data: {
				active: false,
			},
		});
	}

	async findById(id: number): Promise<Contest | null> {
		return this.prismaService.client.contest.findFirst({
			where: {
				id,
			},
			include: {
				fixtures: true,
			},
		});
	}

	async findAll(): Promise<Contest[]> {
		return await this.prismaService.client.contest.findMany({});
	}

	async createContest(contest: ContestEntity): Promise<Contest | undefined> {
		return await this.prismaService.client.contest.create({
			data: {
				title: contest.title,
				content: contest.content,
				active: contest.active,
				start_contest: contest.start_contest,
				end_contest: contest.end_contest,
			},
		});
	}
	async deleteContest(id: number): Promise<Contest | null> {
		try {
			return await this.prismaService.client.contest.delete({
				where: {
					id,
				},
			});
		} catch (err) {
			return null;
		}
	}

	async updateContest(contest: ContestEntity): Promise<Contest> {
		return await this.prismaService.client.contest.update({
			where: {
				id: contest.id,
			},
			data: {
				title: contest.title,
				content: contest.content,
				active: contest.active,
				start_contest: contest.start_contest,
				end_contest: contest.end_contest,
			},
		});
	}
}
