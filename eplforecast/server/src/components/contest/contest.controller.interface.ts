import { NextFunction, Request, Response } from 'express';

export interface ContestControllerInterface {
	getContestById(req: Request, res: Response, next: NextFunction): Promise<void>;
	getContests(req: Request, res: Response, next: NextFunction): Promise<void>;
	getActiveContest(req: Request, res: Response, next: NextFunction): Promise<void>;
	getActiveContestPredictions(req: Request, res: Response, next: NextFunction): Promise<void>;
	createContest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateContest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	deleteContest: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
