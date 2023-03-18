import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ICompetition } from '../laststand.types';
import { LastStandStateService } from '../services/laststand-state.service';

interface IEntry {
  name: string;
  tips: number[];
  eliminatedRound: number;
  expand?: boolean;
}

interface IRound {
  teams: string[];
  result: number;
}

interface IModel {
  rounds: IRound[];
  entries: IEntry[];
}

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrls: ['./ladder.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LadderComponent implements OnInit {

  competition$!: Observable<IModel>;

  constructor(private state: LastStandStateService) { }

  ngOnInit(): void {
    this.competition$ = this.state.competition$.pipe(
      map(c => {

        const rounds = c.rounds.filter(x => x.result > 0).map(r => ({ teams: ['', r.homeTeam, r.awayTeam, 'draw'], result: r.result }));

        const entries = c.entries.map(e => ({
          name: e.name, tips: e.tips, expand: false,
          eliminatedRound: this.getEliminatedRound(e.tips, rounds)
        }));

        const model = {
          rounds: rounds,
          entries: entries.sort((a,b) => a.name.localeCompare(b.name))
        }

        return model;
      })
    );
  }

  private getEliminatedRound(tips: number[], rounds: IRound[]): number {
    for (let i = 0; i != rounds.length; i++) {
      if (tips[i] !== rounds[i].result && rounds[i].result !== 4) {
        return i;
      }
    }

    return -1;
  }
}
