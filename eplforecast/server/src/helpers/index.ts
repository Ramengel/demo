export const dateCompare =
	(MoL: Boolean) =>
	(date1: Date, date2: Date): Boolean => {
		if (MoL) return date1 > date2;
		return date2 > date1;
	};

export const getXDayDate = (xDay: number): Date => {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate() + xDay);
};

export const addHours = (date: Date, hours: number): Date => {
	date.setTime(date.getTime() + hours * 60 * 60 * 1000);

	return date;
};
