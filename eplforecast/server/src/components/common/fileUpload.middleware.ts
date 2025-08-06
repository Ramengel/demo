import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/../../../../public/images/');
	},
	filename: function (req, file, cb) {
		if (file) {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
			const extension = file.originalname.split('.').pop();
			const fileName = uniqueSuffix + '.' + extension;
			req.body.previewImage = fileName;
			cb(null, fileName);
		}
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 20 * 1024 * 1024,
	},
});

export class FileUploadMiddleware implements MiddlewareInterface {
	async execute(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
		const middleware = upload.single('previewImage');
		middleware(req, res, next);
	}
}
