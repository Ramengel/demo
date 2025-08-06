export class FixtureEntity {
	constructor(
		private readonly _id: number,
		private readonly _Fixture_id: number,

		private readonly _home_name: string,
		private readonly _guest_name: string,
		private readonly _home_scores: number | null = 0,
		private readonly _guest_scores: number | null = 0,

		private readonly _status: string,
		private readonly _status_parse: boolean = false,

		private readonly _date: Date,

		private readonly _contest?: any,
	) {}

	get id(): number {
		return this._id;
	}

	get Fixture_id(): number {
		return this._Fixture_id;
	}

	get home_name(): string {
		return this._home_name;
	}

	get guest_name(): string {
		return this._guest_name;
	}

	get home_scores(): number | null {
		return this._home_scores;
	}

	get guest_scores(): number | null {
		return this._guest_scores;
	}

	get status(): string {
		return this._status;
	}

	get status_parse(): boolean {
		return this._status_parse;
	}

	get date(): Date {
		return this._date;
	}

	get contest(): any {
		return this._contest;
	}
}
