declare namespace Express {
	export interface Request {
		initData: any;
		initDataRaw: any;
		file: any;
		user: {
			email: string;
			ri: number;
		};
		err: Error;
		TGError: Error;
	}
}
