export enum AdminNavItemId {
  Admin = 1,
  Seasons = 2,
  SeasonView = 3,
  Payments = 4
}

export interface IAdminNavItem {
  id: AdminNavItemId;
  name: string;
  bold?: boolean;
  route: string[];
}

export enum SeasonStateType {
  None = 0,
  Setup = 1,
  Registration = 2,
  Running = 3,
  Finished = 10,
  Archived = 20
}

export interface ISeasonSummary {
  id: string;
  name: string;
  cost: number;
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
  cost: number;
  players: number;
  teams: number;
  rounds: number;
  tradePeriods: number;
  pointDefinition: IPointDefinition;
}

export interface ISeasonUpdate {
  name: string;
  cost: number;
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
  updated: string;
  name: string;
  owner: string;
  userName: string;
  valid: boolean;
  balance: number;
  paid: boolean;
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

export enum PaymentSearchStatusType {
  Any = 0,
  Succeeded = 1,
  Failed = 2
}

export interface IPaymentSearch {
  from?: string;
  to?: string;
  token: string;
  status: PaymentSearchStatusType;
}

export interface IPaymentSummary {
  id: string;
  tokenId: string;
  created: string;
  success: boolean;
}

export interface IPaymentDetail {
  payment: {
    id: string;
    tokenId: string;
    created: string;
    success: boolean;
    paymentDetails: any;
  };
  teams: ITeamSummary[];
}
