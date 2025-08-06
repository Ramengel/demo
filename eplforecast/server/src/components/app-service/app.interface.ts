export interface AppInterface {
	useExeptionFilters(): void;
	useMiddleware(): void;
	useRoutes(): void;
	close(): void;
	init(): void;
}
