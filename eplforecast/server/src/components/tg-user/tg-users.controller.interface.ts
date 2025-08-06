import { NextFunction, Request, Response } from 'express';

export default interface TGUserControllerInterface {
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
