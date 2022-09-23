import { BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { IPointDefinition, SeasonStateType } from 'src/app/types/public.types';

export { SeasonStateType, IPointDefinition } from 'src/app/types/public.types';

export enum AdminNavItemId {
  Admin = 1,
  Seasons = 2,
  SeasonView = 3,
  Payments = 4,
  Tenants = 5,
  TenantView = 6
}

export interface IAdminNavItem {
  id: AdminNavItemId;
  name: string;
  bold?: boolean;
  route: string[];
}

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
}

export interface ISeasonUpdate {
  name: string;
  cost: number;
  budget: number;
  pointDefinition: IPointDefinition;
  registrationEndDate: string | Date;
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

export const DefaultDatepickerConfig: Partial<BsDatepickerConfig> = {
  adaptivePosition: true,
  showWeekNumbers: false,
  containerClass: 'theme-dark-blue',
  dateInputFormat: 'ddd D MMM YYYY'
};

export const DefaultDaterangepickerConfig: Partial<BsDaterangepickerConfig> = {
  adaptivePosition: true,
  showWeekNumbers: false,
  containerClass: 'theme-dark-blue',
  rangeInputFormat: 'ddd D MMM YYYY',
  rangeSeparator: ' - '
};

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

export interface ITenant {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  created: string;
  updated: string;
}

export interface IAddUpdateTenant {
  name: string;
  slug: string;
  enabled: boolean;
}

export interface ITenantAdmin {
  id: string;
  name: string;
  username: string;
}

export interface IAppUser {
  id: string;
  name: string;
  userName: string;
  email: string;
}
