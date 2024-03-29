export enum SeasonStateType {
  None = 0,
  Setup = 1,
  Registration = 2,
  Running = 3,
  Finished = 10,
  Archived = 20
}

export interface IPublicTenant {
  slug: string;
  name: string;
  usePaymentGateway: boolean;
}

export interface ITenantSeason {
  slug: string;
  name: string;
  seasons: {
    id: string;
    name: string;
    status: SeasonStateType;
    cost: number;
    registrationEndDate: string;
  }[];
  isAdmin?: boolean;
}

export interface IPointDefinition {
  runs: number;
  unassistedWickets: number;
  assistedWickets: number;
  catches: number;
  runouts: number;
  stumpings: number;
}

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
  tradePeriod?: IPublicTradePeriod;
  tenant: string;
  slug: string;
  maxPlayers: number;
  isAdmin?: boolean;
}

export enum TradePeriodType {
  SeasonRegistration = 1,
  TradePeriod = 2
}

export interface IPublicTradePeriod {
  type: TradePeriodType;
  startDate: string;
  endDate: string;
  tradeLimit: number;
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

export interface ICaptains {
  captainId: string;
  viceCaptainId: string;
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
  previousCaptains?: ICaptains;
}

export interface ITeamAndTradePeriod {
  team: ITeam;
  tradePeriod: IPublicTradePeriod;
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

export interface IPlayerLeaderboard extends IPointDefinition {
  id: string;
  name: string;
  rank: number;
  multiplier: number;
  points: number;
}

export interface ITeamLeaderboard extends IPointDefinition {
  id: string;
  name: string;
  owner: string;
  rank: number;
  points: number;
}

export interface IPlayerReportDetail {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  teams: number;
  teamCaptain: number;
  teamViceCaptain: number;
}

export interface IPlayerReportRound extends IPointDefinition {
  round: number;
  points: number;
}

export interface IPlayerReportRoundSummary {
  round: number;
  points: number;
}

export interface IPlayerReportBenchmark {
  name: string;
  type: number;
  rounds: IPlayerReportRoundSummary[];
}

export interface IPlayerReport {
  player: IPlayerReportDetail;
  rounds: IPlayerReportRound[];
  benchmarks: IPlayerReportBenchmark[];
}

export interface ITeamReportDetail {
  id: string;
  name: string;
  owner: string;
}

export interface ITeamReportPlayer {
  id: string;
  name: string;
  multiplier: number;
  cost: number;
  points: number;
  type: TeamPlayerType;
}

export interface ITeamReportRound extends IPointDefinition {
  round: number;
  points: number;
  roundRank: number;
  seasonRank: number;
}

export interface ITeamReportRoundSummary {
  round: number;
  points: number;
  roundRank?: number;
  seasonRank: number;
}

export interface ITeamReportBenchmark {
  name: string;
  type: number;
  rounds: ITeamReportRoundSummary[];
}

export interface ITeamReport {
  team: ITeamReportDetail;
  players: ITeamReportPlayer[];
  rounds: ITeamReportRound[];
  benchmarks: ITeamReportBenchmark[];
}

export interface IPrizeReport {
  name: string;
  description: string;
  team: string;
  owner: string;
  points: number;
}

export interface ISeasonContent {
  name: string;
  content: string;
}
