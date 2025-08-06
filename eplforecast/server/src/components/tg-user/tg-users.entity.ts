import { Prediction } from '@prisma/client';

export class TGUserEntity {
	constructor(
		private readonly _id: number,
		private readonly _username: string,
		private readonly _first_name: string,
		private readonly _ban: boolean,
		private readonly _predictions: Prediction[],
		private readonly _wallet: string | null,
		private readonly _ticket: boolean,
		private readonly _round_place: number | null,
		private readonly _round_points: number | null,
	) {}

	get ticket(): boolean {
		return this._ticket;
	}

	get round_place(): number | null {
		return this._round_place;
	}

	get round_points(): number | null {
		return this._round_points;
	}

	get predictions(): Prediction[] {
		return this._predictions;
	}

	get wallet(): string | null {
		return this._wallet;
	}

	get id(): number {
		return this._id;
	}

	get ban(): boolean {
		return this._ban;
	}

	get username(): string {
		return this._username;
	}

	get first_name(): string {
		return this._first_name;
	}
}
