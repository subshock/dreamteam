import { SeasonStateType } from '../modules/admin/admin.types';

export interface IPublicSeasonInfo {
  id: string;
  name: string;
  cost: number;
  budget: number;
  state: SeasonStateType;
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
  messages: string[];
}
