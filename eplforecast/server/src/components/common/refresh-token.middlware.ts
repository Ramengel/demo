import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware.interface';
import { payloadType } from './auth.middleware';

export class RefreshTokenMiddlware implements MiddlewareInterface {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.secret, (err, payload) => {
				if (err) {
					req.err = err;
				} else if (payload) {
					const { email } = payload as payloadType;
					req.user.email = email;
				}
				next();
			});
		} else {
			next();
		}
	}
}
