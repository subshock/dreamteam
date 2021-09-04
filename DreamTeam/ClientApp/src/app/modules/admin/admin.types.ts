export enum SeasonStateType {
  Setup = 0,
  Registration = 1,
  Running = 2,
  TradePeriod = 3,
  Finished = 10
}

export interface ISeasonSummary {
  id: string;
  name: string;
  created: string;
  updated: string;
  state: SeasonStateType;
}

export interface IPointDefinition {
  runs: number;
  unassistedWickets: number;
  assistedWickets: number;
  catches: number;
  runouts: number;
  stumpings: number;
}

export interface ISeasonView {
  id: string;
  created: string;
  updated: string;
  name: string;
  state: SeasonStateType;
  budget: number;
  players: number;
  teams: number;
  rounds: number;
  pointDefinition: IPointDefinition;
}

export interface ISeasonUpdate {
  name: string;
  budget: number;
  pointDefinition: IPointDefinition;
}

export interface IPlayerUpdate {
  name: string;
  cost: number;
  multiplier: number;
}

export interface IPlayerView {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
}

export interface ITeamSummary {
  id: string;
  created: string;
  updated: string;
  name: string;
  owner: string;
  valid: boolean;
  balance: number;
}

export interface IRoundSummary {
  id: string;
  name: number;
  completed: boolean;
  startDate: string;
  endDate: string;
  players: number;
}

export interface IRoundView {
  id: string;
  name: number;
  completed: boolean;
  startDate: string;
  endDate: string;
  created: string;
  updated: string;
}

export interface IRoundUpdate {
  name: number;
  startDate: string | Date;
  endDate: string | Date;
}

export interface IRoundPlayer {
  id: string;
  playerId: string;
  name: string;
  total: number;
  points: IPointDefinition;
}

export interface IRoundPlayerUpdate {
  playerId: string;
  points: IPointDefinition;
}
