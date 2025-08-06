import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface';
import { validate, parse, type InitDataParsed } from '@telegram-apps/init-data-node';

function setInitData(req: Request, initData: InitDataParsed, raw: string): void {
	req.initData = initData;
	req.initDataRaw = raw;
}

export class TGAuthMiddleware implements MiddlewareInterface {
	constructor(private token: string) {}

	execute(req: Request, res: Response, next: NextFunction): void | Response {
		const [authType, authData = ''] = (req.header('authorization') || '').split(' ');
		if (authType) {
			switch (authType) {
				case 'tma':
					try {
						validate(authData, this.token, {
							expiresIn: 3600,
						});

						setInitData(req, parse(authData), authData);
						next();
					} catch (err) {
						req.TGError = err as Error;
						next(err);
					}
					break;
				default:
					return res
						.status(401)
						.json({
							message: 'Not authorized',
						})
						.send();
			}
		} else {
			return res
				.status(401)
				.json({
					message: 'Not authorized',
				})
				.send();
		}
	}
}
