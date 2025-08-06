export interface TGBotServiceInterface {
	getUser(username: string): Promise<boolean>;
	checkUserSubscribe(user_id: number): Promise<boolean>;
}
