export interface FixtureInterface {
	fixture: FixtureInterface;
	league: LeagueInterface;
	teams: TeamsInterface;
	goals: GoalsInterface;
	score: ScoreInterface;
}

export interface FixtureInterface {
	id: number;
	referee: string;
	timezone: string;
	date: string;
	timestamp: number;
	periods: PeriodsInterface;
	venue: VenueInterface;
	status: StatusInterface;
}

export interface PeriodsInterface {
	first: any;
	second: any;
}

export interface VenueInterface {
	id: number;
	name: string;
	city: string;
}

export interface StatusInterface {
	long: string;
	short: string;
	elapsed: any;
}

export interface LeagueInterface {
	id: number;
	name: string;
	country: string;
	logo: string;
	flag: string;
	season: number;
	round: string;
}

export interface TeamsInterface {
	home: HomeInterface;
	away: AwayInterface;
}

export interface HomeInterface {
	id: number;
	name: string;
	logo: string;
	winner: any;
}

export interface AwayInterface {
	id: number;
	name: string;
	logo: string;
	winner: any;
}

export interface GoalsInterface {
	home: any;
	away: any;
}

export interface ScoreInterface {
	halftime: HalftimeInterface;
	fulltime: FulltimeInterface;
	extratime: ExtratimeInterface;
	penalty: PenaltyInterface;
}

export interface HalftimeInterface {
	home: any;
	away: any;
}

export interface FulltimeInterface {
	home: any;
	away: any;
}

export interface ExtratimeInterface {
	home: any;
	away: any;
}

export interface PenaltyInterface {
	home: any;
	away: any;
}
