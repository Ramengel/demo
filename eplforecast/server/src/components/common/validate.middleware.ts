import { ClassConstructor, plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface';
import { validate } from 'class-validator';

export class ValidateMiddleware implements MiddlewareInterface {
	constructor(private validateClass: ClassConstructor<object>) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.validateClass, req.body);

		validate(instance, { validationError: { target: false } }).then((errors) => {
			if (errors.length > 0) {
				return res.status(422).send(errors);
			}

			next();
		});
	}
}
