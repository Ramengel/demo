import { InitData } from '../../types/customTypes';
import { TGUserEntity } from './tg-users.entity';

export interface TGUserServiceInterface {
	login(initData: InitData): Promise<TGUserEntity | null>;
	getUserInfo(InitData: InitData): Promise<TGUserEntity | null>;
	getUsersByid(ids: any): Promise<any>;
	getUserPredictions(InitData: InitData): Promise<TGUserEntity | null>;
	putUserWallet(initData: InitData, wallet: string): Promise<TGUserEntity | null>;
	clearUserWallet(id: number): Promise<TGUserEntity | null>;
	setTicketActive(InitData: InitData): Promise<boolean>;
	clearRoundTickets(): Promise<void>;
	recalculateround_place(): Promise<void>;
	resetRoundData(): Promise<void>;
}
