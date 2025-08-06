export class ContestEntity {
	constructor(
		private readonly _title: string,
		private readonly _content: string,

		private readonly _active: boolean,
		private readonly _end_contest: Date,
		private readonly _start_contest: Date,

		private readonly _id?: number,
		private readonly _fixtures?: any,
	) {}

	get title(): string {
		return this._title;
	}

	get content(): string {
		return this._content;
	}

	get active(): boolean {
		return this._active;
	}

	get end_contest(): Date {
		return this._end_contest;
	}

	get start_contest(): Date {
		return this._start_contest;
	}

	get id(): number | undefined {
		return this._id;
	}

	get fixtures(): any {
		return this._fixtures ?? [];
	}
}
