import { Api, TelegramClient } from 'telegram';
import { TGBotServiceInterface } from './tg-bot.service.interface';
import { StringSession } from 'telegram/sessions/index.js';
import 'inversify';
import { injectable } from 'inversify';

@injectable()
export class TGBotService implements TGBotServiceInterface {
	private apiId = 10271159;
	private apiHash = '61ba1388dfd2ee03f47cd5afdc775db6';
	private BOT_TOKEN = '7555755255:AAH3FL6m0xcjvRZEASCMIfLnVsnrFY87qfU';

	private chat_id = '@TalehTestChannel';

	private client: TelegramClient;
	private stringSession: string | '';

	async checkUserSubscribe(user_id: number): Promise<boolean> {
		const res = await fetch(
			`https://api.telegram.org/bot${this.BOT_TOKEN}/getChatMember?chat_id=${this.chat_id}&user_id=${user_id}`,
		);

		if (res.ok) {
			return true;
		}

		return false;
	}

	private async setClient(): Promise<void> {
		this.client = new TelegramClient(
			new StringSession(this.stringSession),
			this.apiId,
			this.apiHash,
			{
				connectionRetries: 5,
			},
		);
		await this.client.start({
			botAuthToken: this.BOT_TOKEN,
		});
	}

	private async getClient(): Promise<TelegramClient> {
		if (!this.client) {
			await this.setClient();
		}

		return this.client;
	}

	async getUser(username: string): Promise<boolean> {
		let res = false;

		try {
			const client = await this.getClient();
			res = !!(await client.invoke(
				new Api.users.GetUsers({
					id: [username],
				}),
			));
		} catch (err) {
			console.log(err);
		}

		return res;
	}
}
