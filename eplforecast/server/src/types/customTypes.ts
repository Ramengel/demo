export interface InitData {
	authDate: Date;
	chatInstance: string;
	chatType: string;
	hash: string;
	user: InitDataUser;
}

export interface InitDataUser {
	allowsWriteToPm: boolean;
	first_name: string;
	id: number;
	languageCode: string;
	lastName: string;
	username: string;
}
