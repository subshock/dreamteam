import { IPointDefinition, ITradePeriod, SeasonStateType } from '../modules/admin/admin.types';

export interface IPublicSeasonInfo {
  id: string;
  name: string;
  cost: number;
  budget: number;
  status: SeasonStateType;
  runs: number;
  unassistedWickets: number;
  assistedWickets: number;
  catches: number;
  runouts: number;
  stumpings: number;
}

export interface ITeamRegister {
  name: string;
  owner: string;
}

export interface ITeamRegisterResult {
  success: boolean;
  payment?: boolean;
  messages?: any;
  error?: any;
}

export interface IPublicPlayer extends IPointDefinition {
  name: string;
  id: string;
  cost: number;
  multiplier: number;
  points: number;
}

export enum TeamPlayerType {
  Normal = 0,
  ViceCaptain = 5,
  Captain = 10
}

export interface ITeamPlayer extends IPublicPlayer {
  type: TeamPlayerType;
  added?: boolean;
  removed?: boolean;
}

export interface ITeam {
  id: string;
  name: string;
  owner: string;
  updated: string;
  valid: boolean;
  paid: boolean;
  balance: number;
  players: ITeamPlayer[];
}

export interface ITeamAndTradePeriod {
  team: ITeam;
  tradePeriod: ITradePeriod;
}

export interface ITeamPlayerUpdate {
  players: string[];
  captainPlayerId: string;
  viceCaptainPlayerId: string;
}

export interface ITeamPlayerUpdateResult {
  success: boolean;
  error?: string;
}

export interface IUserTeamSummary {
  id: string;
  name: string;
  owner: string;
  updated: string;
  balance: number;
  paid: boolean;
  valid: boolean;
  points: number | null;
  seasonRank: number | null;
}

export interface IPaymentSettings {
  applicationId: string;
  locationId: string;
  webSdkUrl: string;
}
