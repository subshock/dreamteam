import { Pipe, PipeTransform } from '@angular/core';
import { SeasonStateType } from 'src/app/modules/admin/admin.types';

const stateMap = {
  'name': {
    [SeasonStateType.Setup]: 'Setup',
    [SeasonStateType.Registration]: 'Registration',
    [SeasonStateType.Running]: 'Running',
    [SeasonStateType.Finished]: 'Finished',
    [SeasonStateType.Archived]: 'Archived'
  },
  'desc': {
    [SeasonStateType.Setup]: 'Initial setup of the competition before allowing users to register.',
    [SeasonStateType.Registration]: 'Users can register and start picking their teams.',
    [SeasonStateType.Running]: 'The competition is running, no trades can happen.',
    [SeasonStateType.Finished]: 'The competition is finished, no changes to it may be made. The current player and team '
      + 'standings are final',
    [SeasonStateType.Archived]: 'The season is archived and no longer considered active and appears as an old season'
  }
};

@Pipe({
  name: 'seasonState'
})
export class SeasonStatePipe implements PipeTransform {

  transform(value: number | SeasonStateType, type: 'name' | 'desc' = 'name'): string {
    return stateMap[type][value];
  }
}
