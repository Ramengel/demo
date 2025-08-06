import crypto from 'crypto';

export const verifyTelegramWebAppData = (
	telegramInitData: string,
	TELEGRAM_BOT_TOKEN: string,
): any => {
	const encoded = decodeURIComponent(telegramInitData);

	const secret = crypto.createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_TOKEN);

	const arr = encoded.split('&');
	const hashIndex = arr.findIndex((str) => str.startsWith('hash='));
	const hash = arr.splice(hashIndex)[0].split('=')[1];
	arr.sort((a, b) => a.localeCompare(b));
	const dataCheckString = arr.join('\n');

	const _hash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');

	return _hash === hash;
};
