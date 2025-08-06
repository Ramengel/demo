import { Prediction, User as UserModel } from '@prisma/client';
import { TGUserEntity } from './tg-users.entity';

export interface TGUserRepositoryInterface {
	find: (user: TGUserEntity) => Promise<UserModel | null>;
	findById: (id: number) => Promise<UserModel | null>;
	findOrCreate: (user: TGUserEntity) => Promise<UserModel | undefined>;
	update: (user: TGUserEntity) => Promise<UserModel | undefined>;
	putUserWallet(user: TGUserEntity, wallet: string): Promise<UserModel | null>;
	cleareUserWallet(id: number): Promise<UserModel | null>;
	getUserPredictions: (
		user: TGUserEntity & {
			predictions: Prediction[];
		},
		contest_id: number,
	) => Promise<any>;

	resetRoundTickets(): Promise<void>;
	setTicketActive(user_id: number): Promise<UserModel | undefined>;
	putRoundData(user_id: number, place: number, points: number): Promise<void>;
	putTotalround_points(user_id: number, points: number): Promise<void>;
	resetRoundData(): Promise<void>;

	clearRoundTickets(): Promise<void>;

	recalculateround_place(): Promise<void>;
}
