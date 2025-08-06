import { NextFunction, Request, Response, Router } from 'express';
import { MiddlewareInterface } from '../common/middleware.interface';

export type HTTPMethod = keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;

export interface RouterInterface {
	path: string;
	pathPermission?: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: HTTPMethod;
	middlewares: MiddlewareInterface[];
	permissions?: [];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
