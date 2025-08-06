import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { LoggerServiceInteface } from '../logger/logger.service.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error';
import { UsersRegisterDTO } from './dto/tg-user-register.dto';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TGAuthMiddleware } from '../common/tg-auth.middleware';
import { TGValidateMiddleware } from '../common/tg-validate.middleware';
import { TGUserServiceInterface } from './tg-users.service.interface';
import TGUserControllerInterface from './tg-users.controller.interface';
import { TGUserEntity } from './tg-users.entity';

@injectable()
export class TGUserController extends BaseController implements TGUserControllerInterface {
	constructor(
		@inject(TYPES.LoggerService) private loggerService: LoggerServiceInteface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.TGUserService) private tgUserService: TGUserServiceInterface,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/tg-user/login',
				method: 'post',
				func: this.login,
				middlewares: [
					new TGAuthMiddleware(this.configService.get('TG_TOKEN')),
					new TGValidateMiddleware(this.configService.get('TG_TOKEN')),
				],
				permissions: [],
			},

		]);
	}


	

	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const tgUser: TGUserEntity | null = await this.tgUserService.login(req.initData);
			if (!tgUser) {
				next(new HTTPError('Login error', 401, 'Login'));
			} else {
				this.ok(res, {
					id: tgUser.id,
					username: tgUser.username,
					wallet: tgUser.wallet,
					ticket: tgUser.ticket,
					first_name: tgUser.first_name,
					round_place: tgUser.round_place,
					round_points: tgUser.round_points,
				});
			}
		} catch (err) {
			next(new Error('Internal server error'));
		}
	}

	
}
