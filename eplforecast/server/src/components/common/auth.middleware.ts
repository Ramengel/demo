import { verify, JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface';

export interface payloadType extends JwtPayload {
	email: string;
	ri: number;
}

export class AuthMiddleware implements MiddlewareInterface {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.secret, (err, payload) => {
				if (err) {
					req.err = err;
					next();
				} else if (payload as payloadType) {
					const { email, ri } = payload as payloadType;

					req.user = {
						email,
						ri,
					};

					next();
				}
			});
		} else {
			next();
		}
	}
}
