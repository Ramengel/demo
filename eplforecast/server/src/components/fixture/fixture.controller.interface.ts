import { NextFunction, Request, Response } from 'express';

export interface FixtureControllerInterface {
	getFixtureById(req: Request, res: Response, next: NextFunction): Promise<void>;
	getFixtures: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateFixtures: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getFixturesByContest(req: Request, res: Response, next: NextFunction): Promise<void>;
}
