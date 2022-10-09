import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { IPlayerUpdate, IPlayerView } from '../../tenant-admin.types';
import { TenantStateService } from '../../../tenant/tenant-state.service';
import { TenantAdminService } from '../../tenant-admin.service';
import { PlayerImportDialogComponent } from '../import/player-import-dialog.component';

@Component({
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerListComponent implements OnInit, OnDestroy {

  updateSub = new BehaviorSubject(true);
  players$: Observable<IPlayerView[]>;

  defaultPlayer: IPlayerUpdate = {
    name: '',
    cost: 5,
    multiplier: 1
  };

  editIndex: number | null = null;

  newPlayer: IPlayerUpdate = { ...this.defaultPlayer };
  editPlayer: IPlayerView;

  modalRef?: BsModalRef;

  private subscriptions: Subscription;

  constructor(private state: TenantStateService, private adminApi: TenantAdminService, private cd: ChangeDetectorRef,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.subscriptions = new Subscription();

    this.players$ = combineLatest([this.state.tenant$, this.state.season$, this.updateSub]).pipe(
      switchMap(([t, s]) => this.adminApi.getPlayers(t.slug, s.id))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addPlayer() {
    if (this.newPlayer.name?.length > 0 && this.newPlayer.cost > 0 && this.newPlayer.multiplier > 0) {
      this.subscriptions.add(combineLatest([this.state.tenant$, this.state.season$]).pipe(
        take(1),
        switchMap(([t, s]) => this.adminApi.addPlayer(t.slug, s.id, { ...this.newPlayer }))
      ).subscribe(() => {
        this.refresh(true);
        this.newPlayer = { ...this.defaultPlayer };
      }));
    }
  }

  cancelAddPlayer() {
    this.newPlayer = { ...this.defaultPlayer };
  }

  refresh(updateSeason?: boolean) {
    this.updateSub.next(false);
    if (!!updateSeason) {
      this.state.refreshSeason();
    }
  }

  startUpdatePlayer(player: IPlayerView, index: number) {
    this.editPlayer = { ...player };
    this.editIndex = index;

    setTimeout(() => this.cd.detectChanges());
  }

  deletePlayerModal(player: IPlayerView, template: TemplateRef<IPlayerView>) {
    this.editPlayer = player;
    this.modalRef = this.modalService.show(template);
  }

  deletePlayer(player: IPlayerView) {
    this.subscriptions.add(combineLatest([this.state.tenant$, this.state.season$]).pipe(
      take(1),
      switchMap(([t, s]) => this.adminApi.deletePlayer(t.slug, s.id, player.id))
    ).subscribe(() => {
      this.modalRef.hide();
      this.refresh(true);
    }));
  }

  cancelUpdatePlayer() {
    this.editIndex = null;
  }

  updatePlayer() {
    if (this.editPlayer && this.editPlayer.name?.length > 0 && this.editPlayer.cost > 0 && this.editPlayer.multiplier > 0) {
      this.subscriptions.add(combineLatest([this.state.tenant$, this.state.season$]).pipe(
        take(1),
        switchMap(([t, s]) => this.adminApi.updatePlayer(t.slug, s.id, this.editPlayer.id, {
          name: this.editPlayer.name, cost: this.editPlayer.cost, multiplier: this.editPlayer.multiplier
        }))
      ).subscribe(() => {
        this.editIndex = null;
        this.refresh();
      }));
    }
  }

  import() {
    this.subscriptions.add(combineLatest([this.state.tenant$, this.state.season$]).pipe(take(1)).subscribe(([t, s]) => {
      const ref = this.modalService.show(PlayerImportDialogComponent, {
        initialState: {
          tenantSlug: t.slug, seasonId: s.id
        },
        ignoreBackdropClick: true
      });

      this.subscriptions.add(ref.onHidden.subscribe(() => {
        if (ref.content.result !== false) {
          this.refresh(true);
        }
      }));
    }));
  }
}
