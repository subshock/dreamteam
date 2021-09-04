import { Pipe, PipeTransform } from '@angular/core';
import { SeasonStateType } from 'src/app/modules/admin/admin.types';

@Pipe({
  name: 'seasonState'
})
export class SeasonStatePipe implements PipeTransform {

  transform(value: number | SeasonStateType, ...args: unknown[]): unknown {
    switch (value) {
      case SeasonStateType.Setup: return 'Setup';
      case SeasonStateType.Finished: return 'Finished';
      case SeasonStateType.Registration: return 'Registration';
      case SeasonStateType.Running: return 'Running';
      case SeasonStateType.TradePeriod: return 'Trade Period';
    }

    return value;
  }

}
