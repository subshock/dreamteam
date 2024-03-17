import { BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { ITeamSummary } from '../tenant-admin/tenant-admin.types';

export enum AdminNavItemId {
  Admin = 1,
  Seasons = 2,
  SeasonView = 3,
  Payments = 4,
  Tenants = 5,
  TenantView = 6,
  LastStand = 7
}

export interface IAdminNavItem {
  id: AdminNavItemId;
  name: string;
  bold?: boolean;
  route: string[];
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

export interface ITenant {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  usePaymentGateway: boolean;
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
