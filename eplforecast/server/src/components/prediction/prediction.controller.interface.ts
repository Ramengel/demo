import { NextFunction, Request, Response } from 'express';

export interface PredictionControllerInterface {
	getAllPredictions(req: Request, res: Response, next: NextFunction): Promise<void>;
	createPrediction(req: Request, res: Response, next: NextFunction): Promise<void>;
}
