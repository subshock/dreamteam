import { IPointDefinition, SeasonStateType } from 'src/app/types/public.types';

export interface ISeasonSummary {
  id: string;
  name: string;
  cost: number;
  created: string;
  updated: string;
  status: SeasonStateType;
  registrationEndDate: string;
}

export interface ISeasonView {
  id: string;
  created: string;
  updated: string;
  name: string;
  status: SeasonStateType;
  budget: number;
  cost: number;
  players: number;
  teams: number;
  rounds: number;
  tradePeriods: number;
  prizes: number;
  pointDefinition: IPointDefinition;
  registrationEndDate: string;
  maxPlayers: number;
  scoringPlayers: number;
}

export interface ISeasonUpdate {
  name: string;
  cost: number;
  budget: number;
  pointDefinition: IPointDefinition;
  registrationEndDate: string | Date;
  maxPlayers: number;
  scoringPlayers: number;
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
  updated: string;
  name: string;
  owner: string;
  userName: string;
  valid: boolean;
  balance: number;
  paid: boolean;
}

export enum RoundStateType {
  Creating = 0,
  Completed = 1,
  ReadyToCalculate = 2,
  Calculating = 3
}

export interface IRoundSummary {
  id: string;
  name: number;
  status: RoundStateType;
  startDate: string;
  endDate: string;
  players: number;
}

export interface IRoundView {
  id: string;
  name: number;
  status: RoundStateType;
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

export interface ITradePeriod {
  id: string;
  seasonId: string;
  startDate: string;
  endDate: string;
  tradeLimit: number;
  created: string;
  updated: string;
}

export interface ITradePeriodUpdate {
  startDate: string | Date;
  endDate: string | Date;
  tradeLimit: number;
}

export interface IPrize {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  position: number;
  sortOrder: number;
}

export interface IPrizeUpdate {
  name: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  position: number;
}

