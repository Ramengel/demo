import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware.interface';

export class GuardMiddleware implements MiddlewareInterface {
	execute(req: Request, res: Response, next: NextFunction): Response | void {
		if (req.err) {
			return res
				.status(401)
				.json({
					message: req.err.message,
				})
				.send();
		}
		if (!req.user) {
			return res
				.status(401)
				.json({
					message: 'Not authorized',
				})
				.send();
		}
		{
			next();
		}
	}
}
