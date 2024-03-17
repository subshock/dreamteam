import { Pipe, PipeTransform } from '@angular/core';
import { IRound } from '../laststand.admin.types';

@Pipe({
  name: 'lastStandResult'
})
export class LastStandResultPipe implements PipeTransform {

  transform(value: IRound): string {
    switch (value.result) {
      case 0: return '';
      case 1: return value.homeTeam;
      case 2: return value.awayTeam;
      case 3: return 'Draw';
    }

    return 'Unknown';
  }

}
