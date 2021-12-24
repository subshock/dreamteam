import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { UserApiService } from 'src/app/services/user-api.service';
import {
  IPublicPlayer, IPublicSeasonInfo, IPublicTradePeriod, ITeam, ITeamPlayer, SeasonStateType, TeamPlayerType, TradePeriodType
} from 'src/app/types/public.types';

interface ICurrentTeam {
  balance: number;
  team: ITeamPlayer[];
}

interface IModel {
  team: ITeam;
  season: IPublicSeasonInfo;
  players: IPublicPlayer[];
  tradePeriod: IPublicTradePeriod;
  current: ICurrentTeam;
  canEdit: boolean;
  trades?: { left: number };
}

@Component({
  templateUrl: './team-manage.component.html',
  styleUrls: ['./team-manage.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamManageComponent implements OnInit {

  model$: Observable<IModel>;
  SeasonStateType = SeasonStateType;

  TeamPlayerType = TeamPlayerType;
  TradePeriodType = TradePeriodType;

  saving = false;
  saveErrorSub = new Subject<string>();
  saveError$ = this.saveErrorSub.asObservable();

  playerSearch: string = null;

  private _displayTeam: ITeamPlayer[];

  constructor(private userApi: UserApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const seasonObs = this.userApi.publicApi.getCurrentSeason().pipe(shareReplay(1));
    const playerObs = seasonObs.pipe(
      switchMap(s => this.userApi.publicApi.getSeasonPlayers(s.id))
    );
    const teamObs = this.route.paramMap.pipe(
      switchMap(p => this.userApi.getUserTeam(p.get('id')))
    );

    this.model$ = combineLatest([seasonObs, playerObs, teamObs]).pipe(
      map(([s, p, t]) => ({
        canEdit: this.isWithinTradePeriod(s),
        season: s,
        players: p,
        team: t.team,
        tradePeriod: t.tradePeriod,
        current: {
          balance: t.team.balance,
          team: t.team.players.map(x => ({ ...x }))
        },
        trades: this.getTradesLeft(t.team.players, t.tradePeriod)
      }))
    );
  }

  private isWithinTradePeriod(season: IPublicSeasonInfo): boolean {
    if (season.status !== SeasonStateType.Registration && !season.tradePeriod) {
      return false;
    }

    const endDate = season.tradePeriod ? DateTime.fromISO(season.tradePeriod.endDate) : null;

    if (season.status === SeasonStateType.Registration && (endDate == null || endDate > DateTime.now())) {
      return true;
    }

    if (season.status === SeasonStateType.Running && endDate !== null && endDate > DateTime.now()) {
      return true;
    }

    return false;
  }

  addPlayerToTeam(model: IModel, player: any) {
    // validate and make sure that
    // a) the player isn't already in the team
    // b) the players cost won't break the salar cap
    if (this.getCurrentTeam(model).length >= 12 ||
      model.current.team.find(x => x.id === player.id && !x.removed) != null ||
      model.current.balance - player.cost < 0) {
      return;
    }

    // Check whether this player is already present in the team but removed
    const removedPlayer = model.current.team.find(x => x.id === player.id);
    if (removedPlayer != null) {
      removedPlayer.removed = false;
    } else {
      model.current.team.push({ ...player, added: true });
    }

    model.current.balance -= player.cost;
    model.trades = this.getTradesLeft(model.current.team, model.tradePeriod);
    this._displayTeam = null;
  }

  removePlayerFromTeam(model: IModel, player: any) {
    const idx = model.current.team.indexOf(player);

    if (idx < 0) { return; } // sanity check

    // if the player was added in this session, then just remove it
    if (model.team.players.findIndex(x => x.id === player.id) < 0) {
      model.current.team.splice(idx, 1);
    } else {
      player.removed = true;
    }
    model.current.balance += player.cost;
    model.trades = this.getTradesLeft(model.current.team, model.tradePeriod);
    this._displayTeam = null;
  }

  getCurrentTeam(model: IModel) {
    if (!this._displayTeam) {
      this._displayTeam = model.current.team.filter(x => !x.removed);
    }

    return this._displayTeam;
  }

  getAvailablePlayers(model: IModel) {
    const currentTeam = this.getCurrentTeam(model);
    return model.players.filter(x => !currentTeam.some(p => p.id === x.id) && model.current.balance >= x.cost
      && (!this.playerSearch || x.name.toLowerCase().indexOf(this.playerSearch.toLowerCase()) >= 0));
  }

  setCaptain(model: IModel, player: any) {
    if (!model.canEdit) { return; }
    for (const p of model.current.team) {
      if (p.id === player.id) {
        p.type = TeamPlayerType.Captain;
      } else if (p.type === TeamPlayerType.Captain) {
        p.type = TeamPlayerType.Normal;
      }
    }
    this._displayTeam = null;
  }

  setViceCaptain(model: IModel, player: any) {
    if (!model.canEdit) { return; }
    for (const p of model.current.team) {
      if (p.id === player.id) {
        p.type = TeamPlayerType.ViceCaptain;
      } else if (p.type === TeamPlayerType.ViceCaptain) {
        p.type = TeamPlayerType.Normal;
      }
    }
    this._displayTeam = null;
  }

  isCaptainSet(team: any[]): boolean {
    return team.findIndex(p => p.type === TeamPlayerType.Captain) >= 0;
  }

  isViceCaptainSet(team: any[]): boolean {
    return team.findIndex(p => p.type === TeamPlayerType.ViceCaptain) >= 0;
  }

  isTeamValid(currentTeam: any[], model: IModel) {
    return currentTeam.length === 12
      && model.current.balance >= 0
      && this.isCaptainSet(currentTeam) && this.isViceCaptainSet(currentTeam);
  }

  saveTeam(model: IModel) {
    const currentTeam = this.getCurrentTeam(model);
    if (!this.isTeamValid(currentTeam, model)) { return; }

    const updateModel = {
      players: currentTeam.map(x => x.id),
      captainPlayerId: currentTeam.find(x => x.type === TeamPlayerType.Captain).id,
      viceCaptainPlayerId: currentTeam.find(x => x.type === TeamPlayerType.ViceCaptain).id
    };

    this.saveErrorSub.next(undefined);
    this.saving = true;

    const sub = this.userApi.updateTeamPlayers(model.team.id, updateModel).subscribe(result => {
      sub.unsubscribe();
      this.saving = false;
      if (result.success) {
        this.router.navigate(['../..'], { relativeTo: this.route });
      } else {
        this.saveErrorSub.next(result.error);
      }
    });
  }

  revertTeam(model: IModel) {
    if (model.tradePeriod.type === TradePeriodType.TradePeriod) {
      // restore the team by removing added players, resetting removed players
      // and reassigning captains
      model.current.team = model.current.team.filter(x => !x.added);
      model.current.team.forEach(x => {
        x.removed = false;
        if (model.team.previousCaptains) {
          x.type = (model.team.previousCaptains.captainId === x.id)
            ? TeamPlayerType.Captain
            : (model.team.previousCaptains.viceCaptainId === x.id)
            ? TeamPlayerType.ViceCaptain
            : TeamPlayerType.Normal;
        }
      });

      model.current.team.sort((a, b) => a.type > b.type ? -1 : a.name.localeCompare(b.name));
      model.current.balance = model.season.budget - model.current.team
        .filter(x => !x.removed).reduce((prev, curr) => prev + curr.cost, 0);

    } else {
      model.current.team = model.team.players.map(x => ({ ...x }));
      model.current.balance = model.team.balance;
    }

    model.trades = this.getTradesLeft(model.current.team, model.tradePeriod);
    this._displayTeam = null;
  }

  updatePlayerSearch(search: string) {
    this.playerSearch = search;
  }

  getTradesLeft(teamPlayers: ITeamPlayer[], tradePeriod: IPublicTradePeriod): { left: number } {
    if (tradePeriod && tradePeriod.type === TradePeriodType.TradePeriod) {
      const limit = tradePeriod.tradeLimit;
      const trades = teamPlayers.filter(x => x.added && !x.removed).length;

      return {left: Math.max(0, limit - trades) };
    }

    return { left: 100 };
  }
}
