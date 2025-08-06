export interface PrismaServiceInterface {
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}
