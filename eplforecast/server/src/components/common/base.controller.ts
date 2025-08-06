import { Router, Response } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { ExpressReturnType, RouterInterface } from '../router/router.interface';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: LoggerServiceInteface) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	public created<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 201, message);
	}

	protected bindRoutes(routes: RouterInterface[]): void {
		for (const route of routes) {
			const action = route.func.bind(this);
			const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
			const actions = middlewares ? [...middlewares, action] : action;
			this.router[route.method](route.path, actions);
			this.logger.info(`[${route.method}] ${route.path} ${route.permissions}`);
		}
	}
}
