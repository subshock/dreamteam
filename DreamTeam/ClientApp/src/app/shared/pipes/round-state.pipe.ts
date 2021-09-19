import { Pipe, PipeTransform } from '@angular/core';
import { RoundStateType } from 'src/app/modules/admin/admin.types';

const stateMap = {
  'name': {
    [RoundStateType.Creating]: 'Creating',
    [RoundStateType.ReadyToCalculate]: 'Waiting to Calculate',
    [RoundStateType.Calculating]: 'Calculating',
    [RoundStateType.Completed]: 'Completed'
  },
  'desc': {
    [RoundStateType.Creating]: 'The round has been created and players can be managed.',
    [RoundStateType.ReadyToCalculate]: 'Waiting for the round points to be calculated and distributed to teams.',
    [RoundStateType.Calculating]: 'Calculating points and rankings for the round and distributing to teams.',
    [RoundStateType.Completed]: 'The round is completed with all points and rankings calculated.'
  }
};

@Pipe({
  name: 'roundState'
})
export class RoundStatePipe implements PipeTransform {

  transform(value: number | RoundStateType, type: 'name' | 'desc' = 'name'): string {
    return stateMap[type][value];
  }
}
