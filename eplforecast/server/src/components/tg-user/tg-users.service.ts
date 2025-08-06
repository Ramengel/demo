import { inject, injectable } from 'inversify';
import { TGUserServiceInterface } from './tg-users.service.interface';
import { TGUserEntity } from './tg-users.entity';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TGUserRepositoryInterface } from './tg-users.repository.interface';
import { InitData } from '../../types/customTypes';
import { Prediction } from '@prisma/client';
import { ContestServiceInterface } from '../contest/contest.service.interface';

@injectable()
export class TGUserService implements TGUserServiceInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.TGUserRepository) private tgUsersRepository: TGUserRepositoryInterface,
		@inject(TYPES.ContestService) private contestService: ContestServiceInterface,
	) {}

	async resetRoundData(): Promise<void> {
		await this.tgUsersRepository.resetRoundData();
	}

	async recalculateRoundPlace(): Promise<void> {
		await this.tgUsersRepository.recalculateround_place();
	}

	async clearRoundTickets(): Promise<void> {
		await this.tgUsersRepository.clearRoundTickets();
	}

	async setTicketActive(initData: InitData): Promise<boolean> {
		const { user } = initData;
		if (!user?.id) return false;

		const result = await this.tgUsersRepository.setTicketActive(user.id);
		return Boolean(result);
	}

	async clearUserWallet(id: number): Promise<TGUserEntity | null> {
		const tgUser = await this.tgUsersRepository.cleareUserWallet(id);
		return tgUser ? this.mapToEntity(tgUser) : null;
	}

	async putUserWallet(initData: InitData, wallet: string): Promise<TGUserEntity | null> {
		const { user } = initData;
		if (!user?.id) return null;

		const baseEntity = this.createEntity(user.id, user.username);
		const tgUser = await this.tgUsersRepository.putUserWallet(baseEntity, wallet);
		return tgUser ? this.mapToEntity(tgUser) : null;
	}

	async getUserPredictions(initData: InitData): Promise<TGUserEntity | null> {
		const { user } = initData;
		if (!user?.id) return null;

		const contest = await this.contestService.findActiveContest();
		const baseEntity = this.createEntity(user.id, user.username);
		const tgUser = await this.tgUsersRepository.getUserPredictions(
			baseEntity,
			Number(contest?.id),
		);

		return tgUser ? this.mapToEntity(tgUser) : null;
	}

	async getUsersById(ids: Array<{ user_id: number; _sum: { prediction_result: number } }>): Promise<any[]> {
		const result: any[] = [];

		for (const { user_id, _sum } of ids) {
			const user = await this.tgUsersRepository.findById(user_id);
			if (user) {
				result.push({
					id: user.id,
					first_name: user.first_name,
					prediction_result: _sum.prediction_result,
				});
			}
		}

		return result;
	}

	async login(initData: InitData): Promise<TGUserEntity | null> {
		const { user } = initData;
		if (!user?.id) return null;

		const baseEntity = this.createEntity(user.id, user.username, user.first_name);
		let tgUser = await this.tgUsersRepository.findOrCreate(baseEntity);

		if (tgUser && (tgUser.username !== user.username || tgUser.first_name !== user.first_name)) {
			tgUser = await this.tgUsersRepository.update(baseEntity);
		}

		return tgUser ? this.mapToEntity(tgUser) : null;
	}

	async getUserInfo(initData: InitData): Promise<TGUserEntity | null> {
		const { user } = initData;
		if (!user?.id) return null;

		const baseEntity = this.createEntity(user.id, user.username);
		const tgUser = await this.tgUsersRepository.find(baseEntity);
		return tgUser ? this.createEntity(tgUser.id, tgUser.username) : null;
	}

	private createEntity(
		id: number,
		username = '',
		first_name = '',
		ban = false,
		predictions: Prediction[] = [],
		wallet: string | null = '',
		ticket = false,
		round_points: number | null = null,
		round_place: number | null = null,
	): TGUserEntity {
		return new TGUserEntity(id, username, first_name, ban, predictions, wallet, ticket, round_points, round_place);
	}

	private mapToEntity(user: any): TGUserEntity {
		return this.createEntity(
			user.id,
			user.username,
			user.first_name,
			user.ban,
			user.predictions ?? [],
			user.wallet,
			user.ticket,
			user.round_points,
			user.round_place,
		);
	}
}

