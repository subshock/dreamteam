import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { IPlayerUpdate, IPlayerView } from '../../admin.types';
import { AdminApiService } from '../../services/admin-api.service';
import { SeasonStateService } from '../../services/season-state.service';

@Component({
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerListComponent implements OnInit {

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

  constructor(private state: SeasonStateService, private adminApi: AdminApiService, private cd: ChangeDetectorRef,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.players$ = combineLatest([this.state.season$, this.updateSub]).pipe(
      switchMap(([s]) => this.adminApi.getPlayers(s.id))
    );
  }

  addPlayer() {
    if (this.newPlayer.name?.length > 0 && this.newPlayer.cost > 0 && this.newPlayer.multiplier > 0) {
      const sub = this.state.season$.pipe(
        take(1),
        switchMap(s => this.adminApi.addPlayer(s.id, { ...this.newPlayer }))
      ).subscribe(() => {
        sub.unsubscribe();
        this.refresh(true);
        this.newPlayer = { ...this.defaultPlayer };
      });
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
    const sub = this.state.season$.pipe(
      switchMap(s => this.adminApi.deletePlayer(s.id, player.id))
    ).subscribe(() => {
      sub.unsubscribe();
      this.modalRef.hide();
      this.refresh(true);
    });
  }

  cancelUpdatePlayer() {
    this.editIndex = null;
  }

  updatePlayer() {
    if (this.editPlayer && this.editPlayer.name?.length > 0 && this.editPlayer.cost > 0 && this.editPlayer.multiplier > 0) {
      const sub = this.state.season$.pipe(
        take(1),
        switchMap(s => this.adminApi.updatePlayer(s.id, this.editPlayer.id, {
          name: this.editPlayer.name, cost: this.editPlayer.cost, multiplier: this.editPlayer.multiplier
        }))
      ).subscribe(() => {
        sub.unsubscribe();
        this.editIndex = null;
        this.refresh();
      });
    }
  }
}
