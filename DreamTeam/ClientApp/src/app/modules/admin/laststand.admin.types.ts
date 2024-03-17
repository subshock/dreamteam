
export interface ICompetition {
    id: string;
    name: string;
    active: boolean;
    created: string;
    updated: string;
}

export interface IRound {
    id: string;
    created: string;
    updated: string;
    number: number;
    homeTeam: string;
    awayTeam: string;
    result: number;
}

export interface IEntry {
    id: string;
    created: string;
    updated: string;
    name: string;
    email: string;
}
