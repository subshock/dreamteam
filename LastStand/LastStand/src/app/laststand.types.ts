
export interface IRound {
  homeTeam: string;
  awayTeam: string;
  result: number;
}

export interface IEntry {
  name: string;
  tips: number[];
}

export interface ICompetition {
  id: string;
  name: string;
  registrationEnds: string;
  registrationOpen: boolean;
  cost: number;
  rounds: IRound[];
  entries: IEntry[];
}

export interface IRegister {
  competitionId: string;
  name: string;
  email: string;
  tips: number[];
  paymentToken?: string;
}

export interface IPaymentSettings {
  applicationId: string;
  locationId: string;
  webSdkUrl: string;
}

export interface IRegisterResult {
  success: boolean;
  payment?: boolean;
  messages?: any;
  error?: any;
}
