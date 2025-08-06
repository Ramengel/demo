export class PredictionEntity {
	constructor(
		private readonly _user_id: number,
		private readonly _user: any,

		private readonly _contest_id: number,
		private readonly _contest: any,

		private readonly _Fixture_id: number,
		private readonly _Fixture: any,

		private readonly _home_scores: number,
		private readonly _guest_scores: number,

		private readonly _prediction_result: number | null,
	) {}

	get prediction_result(): number | null {
		return this._prediction_result;
	}

	get home_scores(): number {
		return Number(this._home_scores);
	}

	get guest_scores(): number {
		return Number(this._guest_scores);
	}

	get Fixture_id(): number {
		return Number(this._Fixture_id);
	}

	get Fixture(): any {
		return this._Fixture;
	}

	get contest_id(): number {
		return Number(this._contest_id);
	}

	get contest(): any {
		return this._contest;
	}

	get user_id(): number {
		return Number(this._user_id);
	}

	get user(): any {
		return this._user;
	}
}
