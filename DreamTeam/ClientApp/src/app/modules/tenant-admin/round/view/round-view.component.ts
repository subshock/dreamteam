import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { isNumber } from 'src/app/shared/helpers';
import { IPointDefinition, IPublicTenant } from 'src/app/types/public.types';
import { TenantStateService } from '../../../tenant/tenant-state.service';
import { TenantAdminService } from '../../tenant-admin.service';
import { ISeasonView, IRoundView, IPlayerView, IRoundPlayer, RoundStateType, IRoundPlayerUpdate } from '../../tenant-admin.types';
import { RoundCompleteComponent } from '../dialogs/round-complete.component';
import { RoundReopenComponent } from '../dialogs/round-reopen.component';

interface IModel {
  tenant: IPublicTenant;
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
  refreshRoundSub = new BehaviorSubject<boolean>(true);

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

  constructor(private state: TenantStateService, private adminApi: TenantAdminService, private route: ActivatedRoute,
    private cd: ChangeDetectorRef, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.state.setTabExclusive('rounds');

    this.season$ = this.state.season$;

    this.model$ = combineLatest([this.state.tenant$, this.state.season$, this.route.paramMap, this.refreshRoundSub]).pipe(
      switchMap(([t, s, p]) => combineLatest([this.adminApi.getRound(t.slug, s.id, p.get('id')), this.adminApi.getPlayers(t.slug, s.id)])
        .pipe(
          map(([r, ap]) => ({ tenant: t, season: s, round: r, allPlayers: ap, canEdit: r.status === RoundStateType.Creating }))
        )),
      tap(model => {
        if (model.round.status > 1) {
          setTimeout(() => this.refreshRound(), 2000);
        }
      }),
      shareReplay(1)
    );

    this.players$ = combineLatest([this.model$, this.refreshSub]).pipe(
      switchMap(([m]) => this.adminApi.getRoundPlayers(m.tenant.slug, m.season.id, m.round.id)),
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

  refreshRound() {
    this.refreshRoundSub.next(false);
  }

  addPlayer(tenantSlug: string, seasonId: string, roundId: string) {
    if (this.isValidPlayer(this.newPlayer)) {
      const sub = this.adminApi.addRoundPlayer(tenantSlug, seasonId, roundId, this.newPlayer)
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

  deletePlayer(tenantSlug: string, seasonId: string, roundId: string, p: IRoundPlayer) {
    const sub = this.adminApi.deleteRoundPlayer(tenantSlug, seasonId, roundId, p.id)
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

  updatePlayer(tenantSlug: string, seasonId: string, roundId: string, player: IRoundPlayer) {
    if (this.isValidPlayer(player)) {
      const sub = this.adminApi.updateRoundPlayer(tenantSlug, seasonId, roundId, player.id, player).subscribe(() => {
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
      { initialState: { tenantSlug: model.tenant.slug, seasonId: model.season.id, roundId: model.round.id } });

    const sub = modalRef.onHide.subscribe(() => {
      sub.unsubscribe();
      if (modalRef.content.result) {
        this.refreshRound();
      }
    });
  }

  reopenRound(model: IModel) {
    this.cancelAddPlayer();
    this.cancelUpdatePlayer();

    const modalRef = this.modalService.show(RoundReopenComponent,
      { initialState: { tenantSlug: model.tenant.slug, seasonId: model.season.id, roundId: model.round.id } });

    const sub = modalRef.onHide.subscribe(() => {
      sub.unsubscribe();
      if (modalRef.content.result) {
        this.refreshRound();
      }
    });
  }
}
