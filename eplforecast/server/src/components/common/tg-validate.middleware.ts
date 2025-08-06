import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface';
import { verifyTelegramWebAppData } from './crypto';

export class TGValidateMiddleware implements MiddlewareInterface {
	constructor(private token: string) {}

	execute(req: Request, res: Response, next: NextFunction): void | Response {
		if (req.TGError) {
			res
				.status(401)
				.json({
					message: 'Not authorized',
				})
				.send();
		} else {
			const isTrue = verifyTelegramWebAppData(req.initDataRaw, this.token);
			if (isTrue) {
				next();
			} else {
				res
					.status(401)
					.json({
						message: 'Not authorized',
					})
					.send();
			}
		}
	}
}
