import { User as UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { PrismaService } from '../db/prisma.service';
import { TGUserEntity } from './tg-users.entity';
import { TGUserRepositoryInterface } from './tg-users.repository.interface';

@injectable()
export class TGUserRepository implements TGUserRepositoryInterface {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async recalculateround_place(): Promise<void> {
		const users = await this.prismaService.client.user.findMany({
			orderBy: {
				total_points: 'desc',
			},
		});

		users.forEach(async (user, index: number) => {
			await this.prismaService.client.user.update({
				where: {
					id: user.id,
				},
				data: {
					total_place: Number(index + 1),
				},
			});
		});
	}

	async putTotalround_points(user_id: number, points: number): Promise<void> {
		const user = await this.prismaService.client.user.findFirst({
			where: {
				id: user_id,
			},
		});

		const total_points = user?.total_points;

		const value = Number(total_points) + points;
		const res = await this.prismaService.client.user.update({
			where: {
				id: user_id,
			},
			data: {
				total_points: value,
			},
		});
	}

	async clearRoundTickets(): Promise<void> {
		await this.prismaService.client.user.updateMany({
			data: {
				ticket: false,
			},
		});
	}

	async setTicketActive(user_id: number): Promise<UserModel | undefined> {
		return await this.prismaService.client.user.update({
			where: {
				id: user_id,
			},
			data: {
				ticket: true,
			},
		});
	}

	async putRoundData(user_id: number, place: number, points: number): Promise<void> {
		await this.prismaService.client.user.update({
			where: {
				id: user_id,
			},
			data: {
				round_place: place + 1,
				round_points: points,
			},
		});
	}

	async resetRoundTickets(): Promise<void> {
		await this.prismaService.client.user.updateMany({
			data: {
				ticket: false,
			},
		});
	}

	async resetRoundData(): Promise<void> {
		await this.prismaService.client.user.updateMany({
			data: {
				round_place: null,
				round_points: null,
			},
		});
	}

	async cleareUserWallet(id: number): Promise<UserModel | null> {
		return await this.prismaService.client.user.update({
			where: {
				id,
			},
			data: {
				wallet: null,
			},
		});
	}

	async putUserWallet({ id }: TGUserEntity, wallet: string): Promise<UserModel | null> {
		return await this.prismaService.client.user.update({
			where: {
				id,
			},
			data: {
				wallet,
			},
		});
	}

	async getUserPredictions(user: TGUserEntity, contest_id: number): Promise<any> {
		return await this.prismaService.client.user.findFirst({
			where: {
				id: user.id,
			},
			include: {
				predictions: {
					where: {
						contest_id: contest_id,
					},
				},
			},
		});
	}

	async findById(id: number): Promise<UserModel | null> {
		return await this.prismaService.client.user.findFirst({
			where: {
				id,
			},
		});
	}

	async find({ id }: TGUserEntity): Promise<UserModel | null> {
		return await this.prismaService.client.user.findFirst({
			where: {
				id,
			},
		});
	}

	async findOrCreate({ id, username, first_name }: TGUserEntity): Promise<UserModel | undefined> {
		return await this.prismaService.client.user.upsert({
			where: {
				id,
			},
			update: {},
			create: {
				id,
				username,
				first_name,
			},
		});
	}

	async update({ id, username, first_name }: TGUserEntity): Promise<UserModel | undefined> {
		return await this.prismaService.client.user.update({
			where: {
				id,
			},
			data: {
				username,
				first_name,
			},
		});
	}
}
