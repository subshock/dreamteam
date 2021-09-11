import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ITradePeriod, SeasonStateType } from 'src/app/modules/admin/admin.types';
import { UserApiService } from 'src/app/services/user-api.service';
import { IPublicPlayer, IPublicSeasonInfo, ITeam, ITeamPlayer, TeamPlayerType } from 'src/app/types/public.types';

interface ICurrentTeam {
  balance: number;
  team: ITeamPlayer[];
}

interface IModel {
  team: ITeam;
  season: IPublicSeasonInfo;
  players: IPublicPlayer[];
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

  TeamPlayerType = TeamPlayerType;

  saving = false;
  saveError: string;

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
        season: s,
        players: p,
        team: t.team,
        tradePeriod: t.tradePeriod,
        current: {
          balance: t.team.balance,
          team: t.team.players.map(x => ({...x}))
        }
      }))
    );
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
      if (p.id === player.id) {
        p.type = TeamPlayerType.Captain;
      } else if (p.type === TeamPlayerType.Captain) {
        p.type = TeamPlayerType.Normal;
      }
    }
  }

  setViceCaptain(model: IModel, player: any) {
    for (const p of model.current.team) {
      if (p.id === player.id) {
        p.type = TeamPlayerType.ViceCaptain;
      } else if (p.type === TeamPlayerType.ViceCaptain) {
        p.type = TeamPlayerType.Normal;
      }
    }
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

    this.saveError = null;
    this.saving = true;

    const sub = this.userApi.updateTeamPlayers(model.team.id, updateModel).subscribe(result => {
      sub.unsubscribe();
      this.saving = false;
      if (result.success) {
        this.router.navigate(['../..'], { relativeTo: this.route });
      } else {
        this.saveError = result.error;
      }
    });
  }

  revertTeam(model: IModel) {
    model.current.team = model.team.players.map(x => ({...x}));
    model.current.balance = model.team.balance;
  }
}
