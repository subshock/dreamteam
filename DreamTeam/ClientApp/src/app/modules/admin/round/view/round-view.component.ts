import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { isNumber } from 'src/app/shared/helpers';
import {
  IPlayerView, IPointDefinition, IRoundPlayer, IRoundPlayerUpdate, IRoundView, ISeasonView, RoundStateType
} from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';
import { AdminSeasonStateService } from '../../services/season-state.service';
import { RoundCompleteComponent } from '../complete/round-complete.component';

interface IModel {
  season: ISeasonView;
  round: IRoundView;
  canEdit: boolean;
  allPlayers: IPlayerView[];
}

@Component({
  templateUrl: './round-view.component.html',
  styleUrls: ['./round-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundViewComponent implements OnInit, OnDestroy {

  refreshSub = new BehaviorSubject<boolean>(true);

  model$: Observable<IModel>;
  season$: Observable<ISeasonView>;
  round$: Observable<IRoundView>;
  players$: Observable<IRoundPlayer[]>;

  RoundStateType = RoundStateType;

  availablePlayers$: Observable<IPlayerView[]>;
  defaultNewPlayer: IRoundPlayerUpdate = {
    playerId: null,
    points: {
      runs: 0,
      assistedWickets: 0,
      catches: 0,
      runouts: 0,
      stumpings: 0,
      unassistedWickets: 0
    }
  };
  newPlayer: IRoundPlayerUpdate = { ...this.defaultNewPlayer, points: { ...this.defaultNewPlayer.points } };

  editIndex: number | null = null;
  private editPlayerSub = new BehaviorSubject<IRoundPlayer>(undefined);
  editPlayer$: Observable<IRoundPlayer> = this.editPlayerSub.asObservable();

  modalRef: BsModalRef;

  constructor(private state: AdminSeasonStateService, private adminApi: AdminApiService, private route: ActivatedRoute,
    private cd: ChangeDetectorRef, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.state.setTabExclusive('rounds');

    this.season$ = this.state.season$;

    this.model$ = combineLatest([this.state.season$, this.route.paramMap]).pipe(
      switchMap(([s, p]) => combineLatest([this.adminApi.getRound(s.id, p.get('id')), this.adminApi.getPlayers(s.id)]).pipe(
        map(([r, ap]) => ({ season: s, round: r, allPlayers: ap, canEdit: r.status === RoundStateType.Creating }))
      )),
      shareReplay(1)
    );

    this.players$ = combineLatest([this.model$, this.refreshSub]).pipe(
      switchMap(([m]) => this.adminApi.getRoundPlayers(m.season.id, m.round.id)),
      shareReplay(1)
    );

    this.availablePlayers$ = combineLatest([this.model$, this.players$]).pipe(
      map(([m, p]) => m.allPlayers.filter(ap_x => p.every(p_x => ap_x.id !== p_x.playerId)))
    );
  }

  ngOnDestroy(): void {
    this.state.resetTabs();
  }

  refresh() {
    this.refreshSub.next(false);
  }

  addPlayer(seasonId: string, roundId: string) {
    if (this.isValidPlayer(this.newPlayer)) {
      const sub = this.adminApi.addRoundPlayer(seasonId, roundId, this.newPlayer)
        .subscribe(() => {
          this.refresh();
          this.newPlayer = { ...this.defaultNewPlayer, points: { ...this.defaultNewPlayer.points } };
          sub.unsubscribe();
        });
    }
  }

  isValidPlayer(player: IRoundPlayerUpdate) {
    return player != null && player.points != null
      && player.playerId != null
      && isNumber(player.points.runs) && player.points.runs >= 0
      && isNumber(player.points.unassistedWickets) && player.points.unassistedWickets >= 0
      && isNumber(player.points.assistedWickets) && player.points.assistedWickets >= 0
      && isNumber(player.points.catches) && player.points.catches >= 0
      && isNumber(player.points.runouts) && player.points.runouts >= 0
      && isNumber(player.points.stumpings) && player.points.stumpings >= 0;
  }

  cancelAddPlayer() {
    this.newPlayer = { ...this.defaultNewPlayer };

    setTimeout(() => this.cd.detectChanges());
  }

  calculatePoints(season: ISeasonView, players: IPlayerView[], playerId: string, points: IPointDefinition): number {
    const player = players.find(x => x.id === playerId);

    if (player == null) { return null; }

    return ((points.runs * season.pointDefinition.runs)
      + (points.unassistedWickets * season.pointDefinition.unassistedWickets)
      + (points.assistedWickets * season.pointDefinition.assistedWickets)
      + (points.catches * season.pointDefinition.catches)
      + (points.runouts * season.pointDefinition.runouts)
      + (points.stumpings * season.pointDefinition.stumpings))
      * player.multiplier;
  }

  updatePlayerStart(p: IRoundPlayer, index: number) {
    this.editIndex = index;
    this.editPlayerSub.next({ ...p, points: { ...p.points } });
    setTimeout(() => this.cd.detectChanges());
  }

  deletePlayerStart(p: IRoundPlayer, template: TemplateRef<any>) {
    this.editPlayerSub.next(p);
    this.modalRef = this.modalService.show(template);
  }

  deletePlayer(seasonId: string, roundId: string, p: IRoundPlayer) {
    const sub = this.adminApi.deleteRoundPlayer(seasonId, roundId, p.id)
      .subscribe(() => {
        this.editPlayerSub.next(undefined);
        this.refresh();
        sub.unsubscribe();
      });

    this.modalRef.hide();
  }

  cancelDeletePlayer() {
    this.editPlayerSub.next(undefined);
    this.modalRef.hide();
  }

  updatePlayer(seasonId: string, roundId: string, player: IRoundPlayer) {
    if (this.isValidPlayer(player)) {
      const sub = this.adminApi.updateRoundPlayer(seasonId, roundId, player.id, player).subscribe(() => {
        this.refreshSub.next(false);
        this.cancelUpdatePlayer();
        sub.unsubscribe();
      });
    }
  }

  cancelUpdatePlayer() {
    this.editIndex = null;
    this.editPlayerSub.next(undefined);
  }

  completeRound(model: IModel) {
    this.cancelAddPlayer();
    this.cancelUpdatePlayer();

    const modalRef = this.modalService.show(RoundCompleteComponent,
      { initialState: { seasonId: model.season.id, roundId: model.round.id } });

    const sub = modalRef.onHide.subscribe(() => {
      sub.unsubscribe();
      if (modalRef.content.result) {
        this.refreshSub.next(false);
      }
    });
  }
}
