import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SeasonStateType } from 'src/app/modules/admin/admin.types';
import { IPublicSeasonInfo } from 'src/app/types/public.types';

interface IPlayer {
  name: string;
  id: string;
  cost: number;
  points: number;
}

interface ITeamPlayer extends IPlayer {
  captain?: boolean;
  vicecaptain?: boolean;
  added?: boolean;
  removed?: boolean;
}

interface ITeam {
  id: string;
  name: string;
  balance: number;
  players: ITeamPlayer[];
}

interface ITradePeriod {
  startDate: string;
  endDate: string;
  tradeLimit: number;
}

interface ICurrentTeam {
  balance: number;
  team: ITeamPlayer[];
}

interface IModel {
  team: ITeam;
  season: IPublicSeasonInfo;
  players: IPlayer[];
  tradePeriod: ITradePeriod;
  current: ICurrentTeam;
}

@Component({
  templateUrl: './team-manage.component.html',
  styleUrls: ['./team-manage.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamManageComponent implements OnInit {

  model$: Observable<IModel>;
  SeasonStateType = SeasonStateType;

  constructor(private _cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.model$ = of({
      team: {
        id: 'foo',
        name: 'Poochies Punters',
        balance: 80,
        players: []
      },
      season: {
        id: 'bar',
        name: 'Dragon Dream Team 2021/22',
        state: SeasonStateType.Registration,
        cost: 0,
        budget: 80,
        runs: 1,
        unassistedWickets: 15,
        assistedWickets: 12,
        catches: 10,
        runouts: 10,
        stumpings: 10
      },
      tradePeriod: null,
      players: this.generatePlayers(40),
      current: {
        balance: 80,
        team: [],
      }
    });
  }

  generatePlayers(num: number) {
    const ret = [];

    for (let i = 0; i !== num; i++) {
      ret.push({
        id: i,
        name: `FirstName LastName ${i + 1}`,
        cost: 5 - Math.ceil((i + 5) / num * 4) + 5,
        points: Math.ceil(Math.random() * 1500)
      });
    }

    return ret;
  }

  addPlayerToTeam(model: IModel, player: any) {
    // validate and make sure that
    // a) the player isn't already in the team
    // b) the players cost won't break the salar cap
    if (model.current.team.length >= 12 ||
      model.current.team.find(x => x.id === player.id) != null ||
      model.current.balance - player.cost < 0) {
      return;
    }

    // TODO: FIX THIS
    const removedPlayer = model.current.team.find(x => x.id === player.id && !!x.removed);
    if (removedPlayer != null) {
      removedPlayer.removed = false;
    } else {
      model.current.team.push({ ...player, added: true });
    }

    model.current.balance -= player.cost;
  }

  removePlayerFromTeam(model: IModel, player: any) {
    const idx = model.current.team.indexOf(player);

    if (idx < 0) { return; } // sanity check

    // if the player was added in this session, then just remove it
    if (player.added) {
      model.current.team.splice(idx, 1);
    } else {
      player.removed = true;
    }
    model.current.balance += player.cost;
  }

  getCurrentTeam(model: IModel) {
    return model.current.team.filter(x => !x.removed);
  }

  getAvailablePlayers(model: IModel) {
    const currentTeam = this.getCurrentTeam(model);
    return model.players.filter(x => !currentTeam.some(p => p.id === x.id) && model.current.balance >= x.cost);
  }

  setCaptain(model: IModel, player: any) {
    for (const p of model.current.team) {
      p.captain = false;
    }

    player.captain = true;
    player.vicecaptain = false;
  }

  setViceCaptain(model: IModel, player: any) {
    for (const p of model.current.team) {
      p.vicecaptain = false;
    }

    player.vicecaptain = true;
    player.captain = false;
  }

  isCaptainSet(team: any[]): boolean {
    return team.findIndex(p => p.captain) >= 0;
  }

  isViceCaptainSet(team: any[]): boolean {
    return team.findIndex(p => p.vicecaptain) >= 0;
  }

  isTeamValid(currentTeam: any[], model: IModel) {
    return currentTeam.length === 12
      && model.current.balance >= 0
      && this.isCaptainSet(currentTeam) && this.isViceCaptainSet(currentTeam);
  }

  saveTeam(model: IModel) {

  }

  revertTeam(model: IModel, includeExistingTrades: boolean = false) {
    model.current.team = model.team.players
      .filter(p => includeExistingTrades ? !p.added : true)
      .map(p => ({ ...p, removed: includeExistingTrades ? false : p.removed }));

    model.current.balance = model.team.balance;
  }
}
